# coding: UTF-8

class Table < Sequel::Model(:user_tables)

  # Privacy constants
  PRIVATE = 0
  PUBLIC  = 1

  # Allowed columns
  set_allowed_columns(:name, :privacy)

  ## Callbacks
  def validate
    super
    errors.add(:user_id, 'can\'t be blank')  if user_id.blank?
    errors.add(:name,    'can\'t be blank')  if name.blank?
    validates_unique [:name, :user_id], :message => 'is already taken'
  end

  def before_validation
    self.privacy ||= PUBLIC
  end

  # Before creating a user table a table should be created in the database.
  # This table has an empty schema
  def before_create
    update_updated_at
    unless self.user_id.blank? || self.name.blank?
      unless self.name.blank?
        owner.in_database do |user_database|
          unless user_database.table_exists?(self.name.to_sym)
            user_database.create_table self.name.to_sym do
              primary_key :id
              String :name
              String :location
              String :description, :text => true
            end
          end
        end
      end
    end
    super
  end
  ## End of Callbacks

  def private?
    privacy == PRIVATE
  end

  def public?
    !private?
  end

  def toggle_privacy!
    private? ? set(:privacy => PUBLIC) : set(:privacy => PRIVATE)
    save_changes
  end

  def execute_sql(sql)
    update_updated_at!
    owner.in_database do |user_database|
      user_database[name.to_sym].with_sql(sql).all
    end
  end

  def rows_count
    owner.in_database do |user_database|
      user_database[name.to_sym].count
    end
  end

  def to_json(options = {})
    rows, columns, rows_count = [], [], 0
    limit      = (options[:rows_per_page] || 10).to_i
    offset     = (options[:page] || 0).to_i*limit

    # FIXME: this should be done in one connection block
    owner.in_database do |user_database|
      rows_count = user_database[name.to_sym].count
      columns    = user_database.schema(name.to_sym).map{ |c| [c.first, c[1][:type]] }
    end
    owner.in_database do |user_database|
      rows = user_database[name.to_sym].limit(limit,offset).all
    end

    {
      :total_rows => rows_count,
      :columns => columns,
      :rows => rows
    }
  end

  private

  def update_updated_at
    self.updated_at = Time.now
  end

  def update_updated_at!
    update_updated_at && save_changes
  end

  def owner
    @owner ||= User.select(:id,:database_name).filter(:id => self.user_id).first
  end

end