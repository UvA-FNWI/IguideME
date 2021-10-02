public static class DatabaseQueries
{

    // -------------------- Course preferences --------------------

    public const string CREATE_TABLE_COURSE_SETTINGS =
        @"CREATE TABLE IF NOT EXISTS `course_settings` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `course_name`         STRING,
            `start_date`          DATE NULL,
            `end_date`            DATE NULL,
            `accept_list`         BOOLEAN DEFAULT false,
            `require_consent`     BOOLEAN DEFAULT true,
            `informed_consent`    TEXT NULL,
            `personalized_peers`  BOOLEAN DEAULT true,
            `peer_group_size`     INTEGER DEFAULT 5
        );";

    public const string CREATE_TABLE_ACCEPT_LIST =
        @"CREATE TABLE IF NOT EXISTS `accept_list` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_login_id`       STRING,
            `accepted`            BOOLEAN
        );";

    public const string CREATE_TABLE_PREDICTIVE_MODEL =
        @"CREATE TABLE IF NOT EXISTS `predictive_model` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `entry_collection`    STRING,
            `mse`                 FLOAT
        );";

    public const string CREATE_TABLE_MODEL_THETA =
        @"CREATE TABLE IF NOT EXISTS `model_theta` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `model_id`            INTEGER,
            `tile_id`             INTEGER NULL,
            `entry_id`            INTEGER NULL,
            `intercept`           BOOLEAN,
            `meta_key`            STRING,
            `value`               FLOAT
        );";

    public const string QUERY_DOES_COURSE_EXIST =
        @"SELECT 1
        FROM course_settings
        WHERE course_id = {0};";


    public const string INSERT_COURSE =
        @"INSERT INTO   `course_settings` (`course_id`, `course_name`, `personalized_peers`, `peer_group_size`) 
        VALUES ({0}, '{1}', 0, 5);";

    // -------------------- User preferences --------------------

    /**
     * The consent table stores whether the student gave permission for the 
     * application to use their data. 
     * 
     * NOTE: consent is stored using the course's internal numeric ID instead of
     * the course code. This is to prevent students whom re-take a course to
     * automatically grant consent. 
     * 
     * 
     * `granted` values:
     *  -   1: permission granted
     *  -   0: user did not submit preferences
     *  -  -1: permission denied
     */
    public const string CREATE_TABLE_CONSENT =
        @"CREATE TABLE IF NOT EXISTS consent (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id       INTEGER,
            user_id         INTEGER,
            user_login_id   STRING,
            user_name       STRING,
            granted         INTEGER
        );";

    /**
     * The goal grade is the grade submitted by the student when asked which
     * grade they would like to obtain for the course. This grade is also used
     * to construct the student-specific peer groups.
     */
    public const string CREATE_TABLE_GOAL_GRADE =
        @"CREATE TABLE IF NOT EXISTS goal_grade (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id       INTEGER,
            user_login_id   STRING,
            grade           INTEGER NULL
        );";

    public const string CREATE_TABLE_PEER_GROUP =
        @"CREATE TABLE IF NOT EXISTS `peer_group` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `user_login_id`   STRING,
            `target_login_id` STRING,
            `sync_hash`       STRING
        );";

    public const string CREATE_TABLE_PREDICTED_GRADE =
        @"CREATE TABLE IF NOT EXISTS `predicted_grade` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_login_id`       STRING,
            `grade`               FLOAT,
            `graded_components`   INTEGER,
            `sync_hash`           STRING
        );";

    public const string CREATE_TABLE_NOTIFICATIONS =
        @"CREATE TABLE IF NOT EXISTS `notifications` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_login_id`       INTEGER,
            `tile_id`             INTEGER,
            `status`              STRING,
            `sync_hash`           STRING
        );";

    public const string REGISTER_PREDICTED_GRADE =
        @"INSERT INTO   `predicted_grade` ( `course_id`,
                                            `user_login_id`,
                                            `grade`,
                                            `graded_components`,
                                            `sync_hash` )
          VALUES        ({0}, '{1}', {2}, {3}, '{4}');";

    public const string QUERY_PREDICTED_GRADES =
        @"SELECT    `user_login_id`,
                    (SELECT `id` FROM `tile` WHERE `content_type`='PREDICTION' LIMIT 1) as `tile_id`,
                    `grade`
        FROM        `predicted_grade`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';";

    public const string QUERY_PREDICTED_GRADES_FOR_USER =
        @"SELECT    `user_login_id`,
                    (SELECT `id` FROM `tile` WHERE `content_type`='PREDICTION' LIMIT 1) as tile_id,
                    `grade`,
                    `graded_components`
        FROM        `predicted_grade`
        WHERE       `course_id`={0}
        AND         `user_login_id`='{1}'
        AND         `sync_hash`='{2}';";

    public const string UPDATE_USER_GOAL_GRADE =
        @"UPDATE    `goal_grade`
        SET         `grade` = {0}
        WHERE       `course_id`={1}
        AND         `user_login_id`='{2}';";

    public const string REGISTER_USER_GOAL_GRADE =
        @"INSERT INTO   `goal_grade` (`course_id`, `user_login_id`)
          VALUES        ({0}, '{1}');";

    public const string REGISTER_USER_PEER =
        @"INSERT INTO   `peer_group` (  `course_id`,
                                        `user_login_id`,
                                        `target_login_id`,
                                        `sync_hash`)
          VALUES        ({0}, '{1}', '{2}', '{3}');";

    public const string QUERY_USER_PEERS =
        @"SELECT        `target_login_id`
        FROM            `peer_group`
        WHERE           `course_id`={0}
        AND             `user_login_id`='{1}'
        AND             `sync_hash`='{2}';";

    public const string CREATE_USER_NOTIFICATIONS =
        @"INSERT INTO   `notifications` (   `course_id`,
                                            `user_login_id`,
                                            `tile_id`,
                                            `status`,
                                            `sync_hash`)
          VALUES        ({0}, '{1}', {2}, '{3}', '{4}');";

    public const string QUERY_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`, `status`
        FROM            `notifications`
        WHERE           `course_id`={0}
        AND             `user_login_id`='{1}'
        AND             `sync_hash`='{2}';";

    // -------------------- Predictive models --------------------

    public const string CREATE_PREDICTIVE_MODEL =
        @"INSERT INTO   `predictive_model` (    `course_id`,
                                                `entry_collection`,
                                                `mse` )
          VALUES        ({0}, '{1}', {2});";

    public const string CREATE_MODEL_THETA =
        @"INSERT INTO   `model_theta` ( `model_id`,
                                        `tile_id`,
                                        `entry_id`,
                                        `intercept`,
                                        `meta_key`,
                                        `value`)
          VALUES        ({0}, {1}, {2}, {3}, '{4}', {5});";

    public const string QUERY_MODEL_THETA =
        @"SELECT    `model_theta`.`model_id`,
                    `model_theta`.`tile_id`,
                    `model_theta`.`entry_id`,
                    `model_theta`.`intercept`,
                    `model_theta`.`meta_key`,
                    `model_theta`.`value`
        FROM        `model_theta`
        WHERE       `model_theta`.`model_id`={0}";

    public const string QUERY_PREDICTIVE_MODELS_FOR_COURSE =
        @"SELECT    `predictive_model`.`id`,
                    `predictive_model`.`course_id`,
                    `predictive_model`.`entry_collection`,
                    `predictive_model`.`mse`
        FROM        `predictive_model`
        WHERE       `predictive_model`.`course_id`={0}";

    public const string DELETE_PREDICTIVE_MODELS_FOR_COURSE =
        @"DELETE FROM       `predictive_model`
          WHERE             `course_id`={0};";

    // -------------------- Learning goals --------------------

    public const string CREATE_TABLE_LEARNING_GOALS =
        @"CREATE TABLE IF NOT EXISTS `learning_goal` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `tile_id`             INTEGER,
            `title`               STRING,
            `course_id`           INTEGER
        );";

    public const string CREATE_TABLE_GOAL_REQUREMENTS =
        @"CREATE TABLE IF NOT EXISTS `goal_requirement` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `goal_id`             INTEGER,
            `tile_id`             INTEGER,
            `entry_id`            INTEGER,
            `meta_key`            STRING DEFAULT 'grade',
            `value`               FLOAT,
            `expression`          STRING
        );";

    // -------------------- Course layout --------------------

    /**
     * The user interface can be customized by the course's teachers. The "Tile"
     * visualisation places groups of tiles in columns. The columns are stored
     * in the `layout_column` table.
     */
    public const string CREATE_TABLE_LAYOUT_COLUMN =
        @"CREATE TABLE IF NOT EXISTS `layout_column` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `container_width` STRING,
            `position`        INTEGER
        );";

    /**
     * The `layout_tile_group` table stores all tile groups. A tile group is 
     * a collection of tiles.
     */
    public const string CREATE_TABLE_LAYOUT_TILE_GROUP =
        @"CREATE TABLE IF NOT EXISTS `layout_tile_group` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `title`           STRING,
            `position`        INTEGER,
            `column_id`       INTEGER NULL
        );";

    public const string REGISTER_LAYOUT_COLUMN =
        @"INSERT INTO   `layout_column` (   `course_id`,
                                            `container_width`,
                                            `position`)
        VALUES({0}, '{1}', {2});";

    public const string QUERY_LAYOUT_COLUMNS =
        @"SELECT 
            `id`, `container_width`, `position` 
        FROM
            `layout_column`
        WHERE
            `course_id`={0} 
        ORDER BY
            `position` ASC";

    public const string UPDATE_LAYOUT_COLUMN =
        @"UPDATE    `layout_column`
        SET         `container_width`='{1}',
                    `position`='{2}'
        WHERE       `id`={0};";

    public const string DELETE_LAYOUT_COLUMN =
        @"DELETE FROM   `layout_column`
        WHERE           `id`={0};";

    public const string RELEASE_TILE_GROUPS_FROM_COLUMN =
        @"UPDATE   `layout_tile_group`
        SET         `column_id`=-1
        WHERE       `column_id`={0};";

    // -------------------- Application configuration --------------------

    /**
     * Creates a new table harbouring all configured tiles. Tiles may contain 
     * multiple entries, whom's visualisation are dependent on the parent tile.
     * Tiles are assigned groups and can be of varying types containing 
     * different types of contents.
     * 
     * Content types:
     * - BINARY
     * - ENTRIES
     * - PREDICTION
     * - LEARNING_OUTCOME
     * 
     * Tile types:
     * - ASSIGNMENT
     * - DISCUSSION
     * - EXTERNAL_DATA
     */
    public const string CREATE_TABLE_TILE =
        @"CREATE TABLE IF NOT EXISTS `tile` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `group_id`        INTEGER,
            `title`           STRING,
            `position`        INTEGER,
            `content_type`    STRING,
            `tile_type`       STRING,
            `visible`         BOOLEAN DEFAULT false,
            `notifications`   BOOLEAN DEFAULT false,
            `graph_view`      BOOLEAN DEFAULT false,
            `wildcard`        BOOLEAN DEFAULT false
        );";

    /**
     * Tile entries are descendants of tiles. 
     */
    public const string CREATE_TABLE_TILE_ENTRY =
        @"CREATE TABLE IF NOT EXISTS `tile_entry` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `tile_id`         INTEGER,
            `type`            STRING,
            `title`           STRING,
            `wildcard`        BOOLEAN DEFAULT false,
            `canvas_id`       INTEGER NULL
        );";

    public const string CREATE_TABLE_TILE_ENTRY_SUBMISSION =
        @"CREATE TABLE IF NOT EXISTS `tile_entry_submission` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `entry_id`        INTEGER,
            `user_login_id`   STRING,
            `grade`           FLOAT NULL,
            `submitted`       TEXT NULL,
            `sync_hash`       TEXT
        );";

    public const string CREATE_TABLE_TILE_ENTRY_SUBMISSION_META =
        @"CREATE TABLE IF NOT EXISTS `tile_entry_submission_meta` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `submission_id`   INTEGER,
            `key`             STRING,
            `value`           STRING
        );";

    // -------------------- Course settings --------------------

    public const string QUERY_CONSENT_FOR_COURSE =
        @"SELECT    `course_name`, `require_consent`, `informed_consent`, `accept_list`
        FROM        `course_settings`
        WHERE       `course_id`={0}
        LIMIT       1";

    public const string QUERY_PEER_GROUP_FOR_COURSE =
        @"SELECT    `peer_group_size`, `personalized_peers`
        FROM        `course_settings`
        WHERE       `course_id`={0}
        LIMIT       1";

    public const string UPDATE_CONSENT_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `require_consent`={1},
                    `informed_consent`='{2}'
        WHERE       `course_id`={0};";

    public const string UPDATE_PEER_GROUP_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `peer_group_size`={1},
                    `personalized_peers`={2}
        WHERE       `course_id`={0};";

    public const string REGISTER_ACCEPTED_STUDENT =
        @"INSERT INTO       `accept_list`
                            (   `course_id`,
                                `user_login_id`,
                                `accepted`  )
        VALUES({0}, '{1}', {2});";

    public const string UPDATE_ACCEPT_LIST =
        @"UPDATE    `accept_list`
        SET         `accepted`={2}
        WHERE       `course_id`={0} AND `user_login_id`='{1}';";

    public const string REQUIRE_ACCEPT_LIST =
        @"UPDATE    `course_settings`
        SET         `accept_list`={1}
        WHERE       `course_id`={0};";

    public const string RESET_ACCEPT_LIST =
        @"DELETE FROM   `accept_list`
        WHERE           `course_id`={0};";

    public const string QUERY_ACCEPT_LIST =
        @"SELECT    `user_login_id`, `accepted`
        FROM        `accept_list`
        WHERE       `course_id`={0};";

    // -------------------- Tile logic --------------------

    public const string QUERY_TILE_GROUPS =
        @"SELECT    `layout_tile_group`.`id`,
                    `layout_tile_group`.`title`,
                    `layout_tile_group`.`column_id`,
                    `layout_tile_group`.`position`
        FROM        `layout_tile_group`
        WHERE       `layout_tile_group`.`course_id`={0}";

    public const string REGISTER_TILE_GROUP =
        @"INSERT INTO       `layout_tile_group`
                            (   `course_id`,
                                `column_id`,
                                `title`,
                                `position`  )
        VALUES({0}, {1}, '{2}', {3});";

    public const string DELETE_TILE_GROUP =
        @"DELETE FROM       `layout_tile_group`
          WHERE             `id`={0};";

    public const string UPDATE_TILE_GROUP =
        @"UPDATE    `layout_tile_group`
        SET         `column_id`={1},
                    `title`='{2}',
                    `position`={3}
        WHERE       `id`={0};";

    public const string QUERY_TILES =
        @"SELECT    `tile`.`id`,
                    `tile`.`group_id`,
                    `tile`.`title`,
                    `tile`.`position`,
                    `tile`.`tile_type`,
                    `tile`.`content_type`,
                    `tile`.`visible`,
                    `tile`.`notifications`,
                    `tile`.`graph_view`,
                    `tile`.`wildcard`
        FROM        `tile`,
                    `layout_tile_group`
        WHERE       `layout_tile_group`.`course_id`={0}
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
        ORDER BY    `tile`.`position` ASC;";

    public const string CREATE_TILE =
        @"INSERT INTO  `tile` ( 
                       `group_id`,
                       `title`,
                       `position`,
                       `content_type`,
                       `tile_type`,
                       `visible`,
                       `notifications`,
                       `graph_view`,
                       `wildcard`
                    ) VALUES ({0}, '{1}', {2}, '{3}', '{4}', {5}, {6}, {7}, {8});";

    public const string QUERY_LEARNING_GOALS =
        @"SELECT    `learning_goal`.`id`,
                    `learning_goal`.`tile_id`,
                    `learning_goal`.`title`
        FROM        `learning_goal`
        WHERE       `learning_goal`.`course_id`={0};";

    public const string CREATE_LEARNING_GOAL =
        @"INSERT INTO       `learning_goal`
                            (   `course_id`,
                                `tile_id`,
                                `title`  )
        VALUES({0}, {1}, '{2}');";

    public const string QUERY_GOAL_REQUIREMENTS =
        @"SELECT    `goal_requirement`.`goal_id`,
                    `goal_requirement`.`tile_id`,
                    `goal_requirement`.`entry_id`,
                    `goal_requirement`.`meta_key`,
                    `goal_requirement`.`value`,
                    `goal_requirement`.`expression`
        FROM        `goal_requirement`
        WHERE       `goal_requirement`.`goal_id`={0};";

    public const string CREATE_GOAL_REQUIREMENT =
        @"INSERT INTO       `goal_requirement`
                            (   `goal_id`,
                                `tile_id`,
                                `entry_id`,
                                `meta_key`,
                                `value`,
                                `expression` )
        VALUES({0}, {1}, {2}, '{3}', {4}, '{5}');";


    public const string QUERY_TILE_ENTRIES =
        @"SELECT    `tile_entry`.`id`,
                    `tile_entry`.`tile_id`,
                    `tile_entry`.`title`,
                    `tile_entry`.`type`,
                    `tile_entry`.`wildcard`
        FROM        `tile_entry`,
                    `layout_tile_group`,
                    `tile`
        WHERE       `layout_tile_group`.`course_id`={0}
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
        AND         `tile`.`id`=`tile_entry`.`tile_id`";

    public const string CREATE_TILE_ENTRY =
        @"INSERT INTO       `tile_entry`
                            (   `tile_id`,
                                `title`,
                                `type`,
                                `wildcard`  )
        VALUES({0}, '{1}', '{2}', {3});";

    public const string DELETE_TILE_ENTRY =
         @"DELETE FROM       `tile_entry`
          WHERE             `id`={0};";

    public const string QUERY_TILE_ENTRY_META_KEYS =
        @"SELECT    DISTINCT(`tile_entry_submission_meta`.`key`)
        FROM        `tile_entry_submission`,
                    `tile_entry_submission_meta`
        WHERE       `tile_entry_submission`.`entry_id`={0}
        AND         `tile_entry_submission`.`id`=`tile_entry_submission_meta`.`submission_id`;";

    public const string QUERY_TILE_ENTRY_SUBMISSION_META =
        @"SELECT    `tile_entry_submission_meta`.`key`,
                    `tile_entry_submission_meta`.`value`
        FROM        `tile_entry_submission`,
                    `tile_entry_submission_meta`
        WHERE       `tile_entry_submission`.`id`={0}
        AND         `tile_entry_submission`.`id`=`tile_entry_submission_meta`.`submission_id`;";

    public const string UPDATE_TILE =
        @"UPDATE    `tile`
        SET
                    `group_id`={1},
                    `title`='{2}',
                    `position`={3},
                    `content_type`='{4}',
                    `tile_type`='{5}',
                    `visible`={6},
                    `notifications`={7},
                    `graph_view`={8},
                    `wildcard`={9}
        WHERE       `tile`.`id`={0}";

    // -------------------- Data registry --------------------

    public const string CREATE_TABLE_EXTERNAL_DATA =
        @"CREATE TABLE IF NOT EXISTS `external_data` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `user_login_id`   STRING,
            `tile_id`         INTEGER,
            `title`           STRING,
            `grade`           FLOAT
        );";

    // -------------------- Canvas Datamart --------------------

    public const string CREATE_TABLE_CANVAS_USER =
        @"CREATE TABLE IF NOT EXISTS `canvas_users` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `user_id`         INTEGER,
            `login_id`        STRING,
            `sis_id`          STRING,
            `name`            STRING,
            `sortable_name`   STRING,
            `role`            STRING DEFAULT 'student',
            `sync_hash`       STRING
        );";

    public const string CREATE_TABLE_CANVAS_ASSIGNMENT =
        @"CREATE TABLE IF NOT EXISTS `canvas_assignment` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `assignment_id`   STRING,
            `course_id`       INTEGER,
            `name`            STRING,
            `published`       BOOLEAN DEFAULT true,
            `muted`           BOOLEAN DEFAULT false,
            `due_date`        STRING NULL,
            `points_possible` FLOAT,
            `position`        INTEGER,
            `submission_type` STRING NULL,
            `sync_hash`       STRING
        );";

    public const string CREATE_TABLE_CANVAS_DISCUSSION =
        @"CREATE TABLE IF NOT EXISTS `canvas_discussion` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `discussion_id`   INTEGER,
            `course_id`       INTEGER,
            `tile_id`         INTEGER DEFAULT -1,
            `title`           STRING,
            `posted_by`       STRING,
            `posted_at`       STRING,
            `message`         STRING NULL,
            `sync_hash`       STRING
        );";


    public const string CREATE_TABLE_SYNC_HISTORY =
        @"CREATE TABLE IF NOT EXISTS `sync_history` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `start_timestamp` DATETIME default CURRENT_TIMESTAMP,
            `end_timestamp`   DATETIME NULL,
            `status`          STRING default 'BUSY',
            `hash`            STRING
        );";

    public const string REGISTER_NEW_SYNC =
        @"INSERT INTO   `sync_history` (`course_id`, `hash`)
          VALUES        ({0}, '{1}');";

    public const string COMPLETE_NEW_SYNC =
        @"UPDATE    `sync_history`
        SET         `end_timestamp`=CURRENT_TIMESTAMP,
                    `status`='COMPLETE'
        WHERE       `hash`='{0}';";

    public const string QUERY_COURSE_ASSIGNMENTS =
        @"SELECT    `canvas_assignment`.`id`,
                    `canvas_assignment`.`assignment_id`,
                    `canvas_assignment`.`course_id`,
                    `canvas_assignment`.`name`,
                    `canvas_assignment`.`published`,
                    `canvas_assignment`.`muted`,
                    `canvas_assignment`.`due_date`,
                    `canvas_assignment`.`points_possible`,
                    `canvas_assignment`.`position`,
                    `canvas_assignment`.`submission_type`
        FROM        `canvas_assignment`
        WHERE       `canvas_assignment`.`course_id`={0}
        AND         `canvas_assignment`.`sync_hash`='{1}';";

    public const string QUERY_COURSE_DISCUSSIONS =
        @"SELECT    `canvas_discussion`.`id`,
                    `canvas_discussion`.`discussion_id`,
                    `canvas_discussion`.`course_id`,
                    `canvas_discussion`.`title`,
                    `canvas_discussion`.`posted_by`,
                    `canvas_discussion`.`posted_at`,
                    `canvas_discussion`.`message`
        FROM        `canvas_discussion`
        WHERE       `canvas_discussion`.`course_id`={0}
        AND         `canvas_discussion`.`sync_hash`='{1}'
        AND         `canvas_discussion`.`tile_id`=-1;";

    public const string QUERY_TILE_DISCUSSIONS =
        @"SELECT    `canvas_discussion`.`id`,
                    `canvas_discussion`.`discussion_id`,
                    `canvas_discussion`.`course_id`,
                    `canvas_discussion`.`title`,
                    `canvas_discussion`.`posted_by`,
                    `canvas_discussion`.`posted_at`,
                    `canvas_discussion`.`message`
        FROM        `canvas_discussion`
        WHERE       `canvas_discussion`.`tile_id`={0}
        AND         `canvas_discussion`.`sync_hash`='{1}';";

    public const string QUERY_TILE_DISCUSSIONS_FOR_USER =
        @"SELECT    `canvas_discussion`.`id`,
                    `canvas_discussion`.`discussion_id`,
                    `canvas_discussion`.`course_id`,
                    `canvas_discussion`.`title`,
                    `canvas_discussion`.`posted_by`,
                    `canvas_discussion`.`posted_at`,
                    `canvas_discussion`.`message`
        FROM        `canvas_discussion`
        WHERE       `canvas_discussion`.`tile_id`={0}
        AND         `canvas_discussion`.`posted_by`='{1}'
        AND         `canvas_discussion`.`sync_hash`='{2}';";

    public const string REGISTER_CANVAS_ASSIGNMENT =
        @"INSERT INTO   `canvas_assignment` 
                        (   `assignment_id`,
                            `course_id`,
                            `name`,
                            `published`,
                            `muted`,
                            `due_date`,
                            `points_possible`,
                            `position`,
                            `submission_type`,
                            `sync_hash` ) 
        VALUES('{0}', {1}, '{2}', {3}, {4}, '{5}', {6}, {7}, '{8}', '{9}');";

    public const string REGISTER_CANVAS_DISCUSSION =
        @"INSERT INTO   `canvas_discussion` 
                        (   `discussion_id`,
                            `course_id`,
                            `tile_id`,
                            `title`,
                            `posted_by`,
                            `posted_at`,
                            `message`,
                            `sync_hash` ) 
        VALUES({0}, {1}, '{2}', {3}, '{4}', '{5}', '{6}', '{7}');";

    // -------------------- Data retrieval --------------------

    public const string REGISTER_USER_FOR_COURSE =
        @"INSERT INTO   `canvas_users` 
                        (   `course_id`,
                            `user_id`,
                            `login_id`,
                            `sis_id`,
                            `name`,
                            `sortable_name`,
                            `role`,
                            `sync_hash`) " +
                "VALUES({0}, {1}, '{2}', '{3}', '{4}', '{5}', '{6}', '{7}');";

    public const string QUERY_SYNC_HASHES_FOR_COURSE =
        @"SELECT    `id`,
                    `course_id`,
                    `start_timestamp`,
                    `end_timestamp`,
                    `status`,
                    `hash`
        FROM        `sync_history`
        WHERE       `course_id`={0}
        ORDER BY    `end_timestamp` DESC";

    public const string QUERY_LATEST_SYNC_FOR_COURSE =
        @"SELECT    `hash`
        FROM        `sync_history`
        WHERE       `status`='COMPLETE'
        AND         `course_id`={0}
        ORDER BY    `end_timestamp` DESC
        LIMIT       1";

    public const string QUERY_USERS_FOR_COURSE =
        @"SELECT    `id`,
                    `user_id`,
                    `login_id`,
                    `sis_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}'
        ORDER BY    `name` ASC";

    public const string QUERY_USERS_WITH_ROLE_FOR_COURSE =
        @"SELECT    `id`,
                    `user_id`,
                    `login_id`,
                    `sis_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`={0}
        AND         `role`='{1}'
        AND         `sync_hash`='{2}'
        ORDER BY    `name` ASC";

    public const string QUERY_USER_FOR_COURSE =
        @"SELECT    `id`,
                    `user_id`,
                    `login_id`,
                    `sis_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`={0}
        AND         `login_id`='{1}'
        AND         `sync_hash`='{2}'
        ORDER BY    `name` ASC
        LIMIT       1;";

    public const string QUERY_USERS_WITH_GOAL_GRADE =
        @"SELECT    `canvas_users`.`id`,
                    `canvas_users`.`user_id`,
                    `canvas_users`.`login_id`,
                    `canvas_users`.`sis_id`,
                    `canvas_users`.`name`,
                    `canvas_users`.`sortable_name`,
                    `canvas_users`.`role`
        FROM        `goal_grade`, `canvas_users`
        WHERE       `canvas_users`.`login_id`=`goal_grade`.`user_login_id`
        AND         `canvas_users`.`course_id`=`goal_grade`.`course_id`
        AND         `goal_grade`.`course_id`={0}
        AND         `canvas_users`.`sync_hash`='{1}'
        AND         `goal_grade`.`grade`={2};";

    public const string QUERY_USER_GOAL_GRADE =
        @"SELECT    `grade`
        FROM        `goal_grade`
        WHERE       `course_id`={0}
        AND         `user_login_id`='{1}'
        AND         `grade` IS NOT NULL
        LIMIT       1;";

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_login_id`,
                    `grade`,
                    `submitted`
        FROM        `tile_entry_submission`
        WHERE       `entry_id`='{0}'
        AND         `sync_hash`='{1}';";

    public const string QUERY_COURSE_SUBMISSIONS =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`,
                    `tile`,
                    `tile_entry`,
                    `layout_tile_group`,
                    `layout_column`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        AND         `tile`.`id`=`tile_entry`.`tile_id`
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
        AND         `layout_column`.`course_id`={0}
        AND         `tile_entry_submission`.`sync_hash`='{1}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`, `tile_entry`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        AND         `tile_entry`.`tile_id`={0}
        AND         `tile_entry_submission`.`user_login_id`='{1}'
        AND         `tile_entry_submission`.`sync_hash`='{2}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER_PEERS =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`, `tile_entry`, `peer_group`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        AND         `tile_entry`.`tile_id`={0}
        AND         `peer_group`.`user_login_id`='{1}'
        AND         `tile_entry_submission`.`user_login_id`=`peer_group`.`target_login_id`
        AND         `peer_group`.`sync_hash`='{2}'
        AND         `tile_entry_submission`.`sync_hash`='{2}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_USER =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`, `tile_entry`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        AND         `tile_entry_submission`.`user_login_id`='{0}'
        AND         `tile_entry_submission`.`sync_hash`='{1}';";

    public const string QUERY_USER_PEER_GRADES =
        @"SELECT   `tile`.`id`,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  AVG(`grade`) * 100
            ELSE                AVG(`grade`)
       	END average,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  MIN(`grade`) * 100
            ELSE                MIN(`grade`)
       	END minimum,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  MAX(`grade`) * 100
            ELSE                MAX(`grade`)
       	END maximum
        FROM        `tile_entry_submission`,
                    `tile_entry`,
                    `peer_group`,
                    `tile`,
                    `layout_column`,
                    `layout_tile_group`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
	    AND	        `tile`.`content_type` != 'LEARNING_OUTCOMES'
	    AND	        `tile`.`content_type` != 'PREDICTION'
        AND	        `tile`.`tile_type` != 'DISCUSSIONS'
	    AND	        `tile`.`id`=`tile_entry`.`tile_id`
        AND         `layout_column`.`course_id`={0}
        AND         `layout_tile_group`.`column_id`=`layout_column`.`id`
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
        AND         `peer_group`.`user_login_id`='{1}'
        AND         `tile_entry_submission`.`user_login_id`=`peer_group`.`target_login_id`
        AND         `peer_group`.`sync_hash`='{2}'
        AND         `tile_entry_submission`.`sync_hash`='{2}'
	    GROUP BY    `tile`.`id`;";

    public const string QUERY_USER_RESULTS =
        @"SELECT   `tile`.`id`,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  AVG(`grade`) * 1
            ELSE                AVG(`grade`)
       	END average,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  MIN(`grade`) * 1
            ELSE                MIN(`grade`)
       	END minimum,
	    CASE `tile`.`content_type` 
            WHEN 'BINARY' THEN  MAX(`grade`) * 1
            ELSE                MAX(`grade`)
       	END maximum
        FROM        `tile_entry_submission`,
                    `tile_entry`,
                    `tile`,
                    `layout_column`,
                    `layout_tile_group`
        WHERE       `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        AND         `layout_column`.`course_id`={0}
        AND         `layout_tile_group`.`column_id`=`layout_column`.`id`
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
	    AND	        `tile`.`id`=`tile_entry`.`tile_id`
        AND         `tile_entry_submission`.`user_login_id`='{1}'
        AND         `tile_entry_submission`.`sync_hash`='{2}'
	    GROUP BY `tile`.`id`;";

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_login_id`,
                    `grade`,
                    `submitted`
        FROM        `tile_entry_submission`
        WHERE       `entry_id`='{0}'
        AND         `user_login_id`='{1}'
        AND         `sync_hash`='{2}';";

    public const string QUERY_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_login_id`,
                    `grade`,
                    `submitted`
        FROM        `tile_entry_submission`
        WHERE       `entry_id`='{0}'
        AND         `sync_hash`='{1}';";

    public const string CREATE_USER_SUBMISSION =
        @"INSERT INTO   `tile_entry_submission` 
                        (   `entry_id`,
                            `user_login_id`,
                            `grade`,
                            `submitted`,
                            `sync_hash` ) 
        VALUES({0}, '{1}', '{2}', '{3}', '{4}');";

    public const string RECYCLE_EXTERNAL_DATA =
        @"UPDATE   `tile_entry_submission` 
          SET      `sync_hash`='{1}'
          WHERE    `entry_id` IN (
            SELECT  `tile_entry`.`id`
            FROM    `tile`, `tile_entry`, `layout_tile_group`
            WHERE   `layout_tile_group`.`course_id`={0}
            AND     `layout_tile_group`.`id`=`tile`.`group_id`
            AND     `tile`.`id`=`tile_entry`.`tile_id`
            AND     `tile`.`tile_type`='EXTERNAL_DATA'
          );";

    public const string CREATE_SUBMISSION_META =
        @"INSERT INTO   `tile_entry_submission_meta`
                        (   `submission_id`,
                            `key`,
                            `value`)
        VALUES ({0},'{1}','{2}');";
}
 
 
 
 
 
 
 
 
 
 