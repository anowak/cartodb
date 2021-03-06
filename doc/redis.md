# Redis #

## List of Redis Databases ##

The databases used by CartoDB are:

  - **0 - tables_metadata**: stores metadata from cartodb tables
  - **1 - queries_log**: stores an entry per request performed, storing the IP of the request and some information of the request (deactivated)
  - **2 - threshold**: stores the number of queries run per user and per table, and the kind of those queries (selects, inserts....)
  - **3 - api_credentials**: stores the credentials to access to CartoDB via API. This credentials are OAuth validated tokens and API keys
  - **4 - node_details**: base DB used for nodejs tiler. Will change in future
  - **5 - users_metadata**: stores metadata about the users account and database
  
### tables_metadata database ###

`tables_metadata` database stores metadata from the user tables. This metadata can be the privacy of the table, the owner identifier, the schema, and so on. 

The database is structured in hashes. The key of each hash has the following format:

  rails:<database_name>:<table_name>
  
The values of the hash are:

  - `the_geom_type`: the geometry type. Example: `point`
  - `infowindow`: the CSV string of values to use in the infowindow SQL. eg. 'id, name, description'. Should be suitable for passing to the CartoDB API
  - `privacy`: the privacy of the table. 0 means **private** and 1 means **public**
  - `user_id`: the identifier of the owner
  
### queries_log database ###

_deactivated_

`queries_log` database stores in a list each request performed to the API. Each list is identified by this key:

  log-<date>
    
Where date has the format `%Y-%m-%d`, i.e. 2011-10-3.

The information stored per request is a string which contains the IP, the controller name and the action name, separated by '#'. Example:

  85.223.1.123#queries#run

### threshold ###

`threshold` database stores a list of counters related to the number of queries performed by a user in his database. There are different types of counters:

  - `rails:users:<id>:queries:total`: the number of queries the user has perfomed in total
  - `rails:users:<id>:queries:<date_year_month_day>`: the number of queries the user has performed in a day
  - `rails:users:<id>:queries:<date_year_month_day>:time`: the accumulated time of the queries run by the user in a day
  - `rails:users:<id>:queries:<date_year_month>`: the number of queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:select`: the number of select queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:insert`: the number of insert queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:update`: the number of update queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:delete`: the number of delete queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:other`: the number of other type of queries the user has perfomed this month
  - `rails:users:<id>:queries:<date_year_month>:time`: the accumulated time of the queries run by the user in a month
    
Where `id` is the identifier of the user, `date_year_month` is the date in format `%Y-%m`, and `date_year_month_day` is the date in format `%Y-%m-%d`.

Each of this keys stores a counter, which can be increased by `INCR` command.

### api_credentials ###

`api_credentials` database stores a list of credentials which can be used to be authenticated via the API. The database is organized in hashes. Each hash is identified by this format of key:

  rails:oauth_tokens:<token>
    
The values of the hash are:

  - `user_id`: the identifier of the user which is associated to the token
  - `time`: the time which the token was created

### node_details ###

`node_details` database holds information relating to the correct running of the cartoDB tileserver. In addition to storing primary key indeces and user specified map styles, it may eventually be used as a tile cache. The following keys are used:

	node:pkey - pk store
  node:style:<style_id> - style data store
  node:user:<user_id>:styles - set of style keys belonging to user
  node:style:<style_id>:users" - set of user keys belonging to a style
  node:user:<user_id>:layer:<layer_id>:style - Default style key per user/layer combo. used if user specifies a style.

### users_metadata ###

`users_metadata` Holds records of the username/subdomain to id and name of database so that we can easily go from their subdomain to their user database. The following keys are used:

  rails:users:<username/subdomain> - hash of: id, database_name