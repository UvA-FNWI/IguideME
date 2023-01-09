using System.Collections.Generic;

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

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL =
        @"CREATE TABLE IF NOT EXISTS `grade_prediction_model` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `intercept`           FLOAT,
            `enabled`             BOOLEAN
        );";

    public const string CREATE_TABLE_PREDICTED_GRADE =
        @"CREATE TABLE IF NOT EXISTS `predicted_grade` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_login_id`       STRING,
            `grade`               FLOAT,
            `date`                TEXT,
            UNIQUE(course_id, user_login_id, date)
        );";

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER =
        @"CREATE TABLE IF NOT EXISTS `grade_prediction_model_parameter` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `model_id`            INTEGER,
            `parameter_id`        INTEGER,
            `weight`              FLOAT
        );";

    public const string QUERY_DOES_COURSE_EXIST =
        @"SELECT 1
        FROM course_settings
        WHERE course_id = {0};";


    public const string INSERT_COURSE =
        @"INSERT INTO   `course_settings` (`course_id`, `course_name`, `personalized_peers`, `peer_group_size`)
        VALUES ({0}, '{1}', 0, 5);";

    public const string QUERY_COURSE_IDS =
        @"SELECT `course_id` FROM `course_settings`;";



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
            granted         INTEGER,
            UNIQUE(course_id, user_id)
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
            grade           INTEGER NULL,
            UNIQUE(course_id, user_login_id)
        );";

    public const string CREATE_TABLE_PEER_GROUP =
        @"CREATE TABLE IF NOT EXISTS `peer_group` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `user_login_id`   STRING,
            `target_login_id` STRING,
            `sync_hash`       STRING
        );";

    public const string CREATE_TABLE_NOTIFICATIONS =
        @"CREATE TABLE IF NOT EXISTS `notifications` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_login_id`       STRING,
            `tile_id`             INTEGER,
            `status`              STRING,
            `sync_hash`           STRING,
            `sent`                BOOLEAN
        );";

    public const string CREATE_TABLE_MIGRATIONS =
        @"CREATE TABLE IF NOT EXISTS `migrations` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `migration_id`        STRING
        );";

    public const string REGISTER_PREDICTED_GRADE =
        @"INSERT INTO   `predicted_grade` ( `course_id`,
                                            `user_login_id`,
                                            `grade`,
                                            `date` )
          VALUES        ({0}, '{1}', {2}, CURRENT_DATE)
          ON CONFLICT (`course_id`, `user_login_id`, `date`) DO UPDATE SET `grade`=`excluded`.`grade`;";

    public const string QUERY_PREDICTED_GRADES_FOR_USER =
        @"SELECT    `user_login_id`,
                    `date`,
                    `grade`
        FROM        `predicted_grade`
        WHERE       `course_id`={0}
        AND         `user_login_id`='{1}'
        ORDER BY    `date` DESC;";

    public const string UPDATE_USER_GOAL_GRADE =
        @"UPDATE    `goal_grade`
        SET         `grade` = {0}
        WHERE       `course_id`={1}
        AND         `user_login_id`='{2}';";

    public const string REGISTER_USER_GOAL_GRADE =
        @"INSERT INTO   `goal_grade` (`course_id`, `user_login_id`)
          VALUES        ({0}, '{1}')
          ON CONFLICT   (`course_id`, `user_login_id` ) DO NOTHING;";

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
                                            `sent`,
                                            `sync_hash`)
          VALUES        ({0}, '{1}', {2}, '{3}', false, '{4}');";

    public const string QUERY_ALL_NOTIFICATIONS =
        @"SELECT        `user_login_id`,
                        `tile_id`,
                        `status`,
                        `sent`
        FROM            `notifications`
        WHERE           `course_id`={0}
        AND             `sync_hash`='{1}';";

    public const string QUERY_ALL_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`, `status`, `sent`
        FROM            `notifications`
        WHERE           `course_id`={0}
        AND             `user_login_id`='{1}'
        AND             `sync_hash`='{2}';";

    public const string QUERY_PENDING_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`, `status`
        FROM            `notifications`
        WHERE           `course_id`={0}
        AND             `user_login_id`='{1}'
        AND             `sync_hash`='{2}'
        AND             `sent`=false;";

    public const string QUERY_MARK_NOTIFICATIONS_SENT =
        @"UPDATE        `notifications`
        SET             `sent`=true
        WHERE           `course_id`={0}
        AND             `user_login_id`='{1}'
        AND             `sync_hash`='{2}';";

    // -------------------- Predictive models --------------------

    public const string CREATE_GRADE_PREDICTION_MODEL =
        @"INSERT INTO   `grade_prediction_model` (    `course_id`,
                                                      `intercept`,
                                                      `enabled`    )
          VALUES        ({0}, {1}, True);";

    public const string CREATE_GRADE_PREDICTION_MODEL_PARAMETER =
        @"INSERT INTO   `grade_prediction_model_parameter` (    `model_id`,
                                                                `parameter_id`,
                                                                `weight` )
          VALUES        ({0}, '{1}', {2});";

    public const string QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE =
        @"SELECT    `grade_prediction_model`.`id`,
                    `grade_prediction_model`.`intercept`,
                    `grade_prediction_model`.`enabled`
        FROM        `grade_prediction_model`
        WHERE       `grade_prediction_model`.`course_id`={0};";

    public const string QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE =
        @"SELECT    `grade_prediction_model`.`id`,
                    `grade_prediction_model`.`intercept`
        FROM        `grade_prediction_model`
        WHERE       `grade_prediction_model`.`course_id`={0}
        AND         `grade_prediction_model`.`enabled`=True
        LIMIT 1;";

    public const string QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL =
        @"SELECT    `grade_prediction_model_parameter`.`id`,
                    `grade_prediction_model_parameter`.`model_id`,
                    `grade_prediction_model_parameter`.`parameter_id`,
                    `grade_prediction_model_parameter`.`weight`
        FROM        `grade_prediction_model_parameter`
        WHERE       `grade_prediction_model_parameter`.`model_id`={0};";

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
        @"SELECT    `id`,
                    `container_width`,
                    `position`
        FROM
            `layout_column`
        WHERE
            `course_id`={0}
        ORDER BY
            `position` ASC;";

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
     * - LEARNING_OUTCOMES
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
            `value`           STRING,
            `sync_hash`       TEXT
        );";

    // -------------------- Course settings --------------------

    public const string QUERY_CONSENT_FOR_COURSE =
        @"SELECT    `course_name`, `require_consent`, `informed_consent`, `accept_list`
        FROM        `course_settings`
        WHERE       `course_id`={0}
        LIMIT       1;";

    public const string QUERY_PEER_GROUP_FOR_COURSE =
        @"SELECT    `peer_group_size`, `personalized_peers`
        FROM        `course_settings`
        WHERE       `course_id`={0}
        LIMIT       1;";

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
        WHERE       `layout_tile_group`.`course_id`={0};";

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
        FROM        `tile`
        INNER JOIN  `layout_tile_group`
            ON      `layout_tile_group`.`id`=`tile`.`group_id`
        WHERE       `layout_tile_group`.`course_id`={0}
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
        @"SELECT    `id`,
                    `tile_id`,
                    `title`
        FROM        `learning_goal`
        WHERE       `course_id`={0};";

    public const string QUERY_TILE_LEARNING_GOALS =
        @"SELECT    `id`,
                    `title`
        FROM        `learning_goal`
        WHERE       `course_id`={0}
        AND         `tile_id`={1};";

    public const string QUERY_LEARNING_GOAL =
        @"SELECT    `tile_id`,
                    `title`
        FROM        `learning_goal`
        WHERE       `course_id`={0}
        AND         `id`={1};";

    public const string CREATE_LEARNING_GOAL =
        @"INSERT INTO       `learning_goal`
                            (   `course_id`,
                                `tile_id`,
                                `title`  )
        VALUES({0}, {1}, '{2}');";

    public const string UPDATE_LEARNING_GOAL =
        @"UPDATE    `learning_goal`
        SET
                    `title`='{3}'
        WHERE       `id`={1}
        AND         `tile_id`={2}
        AND         `course_id`={0};";

    public const string DELETE_LEARNING_GOAL =
        @"DELETE FROM       `learning_goal`
          WHERE             `course_id` = {0}
          AND               `id` = {1};";

    public const string QUERY_GOAL_REQUIREMENTS =
        @"SELECT
                    `id`,
                    `goal_id`,
                    `tile_id`,
                    `entry_id`,
                    `meta_key`,
                    `value`,
                    `expression`
        FROM        `goal_requirement`
        WHERE       `goal_id`={0};";

    public const string CREATE_GOAL_REQUIREMENT =
        @"INSERT INTO       `goal_requirement`
                            (   `goal_id`,
                                `tile_id`,
                                `entry_id`,
                                `meta_key`,
                                `value`,
                                `expression` )
        VALUES({0}, {1}, {2}, '{3}', {4}, '{5}');";

    public const string UPDATE_LEARNING_GOAL_REQUIREMENT =
        @"UPDATE    `goal_requirement`
        SET
                    `tile_id`={2},
                    `entry_id`={3},
                    `meta_key`='{4}',
                    `value`={5},
                    `expression`='{6}'
        WHERE
                    `id`={0}
        AND
                    `goal_id`={1}
        ;";

    public const string DELETE_GOAL_REQUIREMENTS =
        @"DELETE FROM       `goal_requirement`
          WHERE             `goal_id` = {0};";

    public const string DELETE_GOAL_REQUIREMENT =
        @"DELETE FROM       `goal_requirement`
          WHERE             `goal_id` = {0}
          AND               `id` = {1};";

    public const string QUERY_TILE_ENTRIES =
        @"SELECT    `tile_entry`.`id`,
                    `tile_entry`.`tile_id`,
                    `tile_entry`.`title`,
                    `tile_entry`.`type`,
                    `tile_entry`.`wildcard`
        FROM        `tile_entry`
        INNER JOIN  `tile`
            ON      `tile`.`id`=`tile_entry`.`tile_id`
        INNER JOIN  `layout_tile_group`
            ON      `layout_tile_group`.`id`=`tile`.`group_id`
        WHERE       `layout_tile_group`.`course_id`={0}
        ;";

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
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry_submission_meta`
            ON      `tile_entry_submission`.`id`=`tile_entry_submission_meta`.`submission_id`
        WHERE       `tile_entry_submission`.`entry_id`={0}
            ;";

    public const string QUERY_TILE_ENTRY_SUBMISSION_META =
        @"SELECT    `tile_entry_submission_meta`.`key`,
                    `tile_entry_submission_meta`.`value`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry_submission_meta`
            ON      `tile_entry_submission`.`id`=`tile_entry_submission_meta`.`submission_id`
        WHERE       `tile_entry_submission`.`id`={0}
        AND         `tile_entry_submission_meta`.`sync_hash`='{1}'
        ;";

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
        WHERE       `tile`.`id`={0};";

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
            `grading_type`    INTEGER,
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

    public const string CREATE_TABLE_CANVAS_DISCUSSION_ENTRY =
        @"CREATE TABLE IF NOT EXISTS `canvas_discussion_entry` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `discussion_id`   INTEGER,
            `posted_by`       STRING,
            `posted_at`       STRING,
            `message`         STRING NULL,
            UNIQUE(course_id, posted_by, discussion_id, posted_at)
        );";

    public const string CREATE_TABLE_CANVAS_DISCUSSION_REPLY =
        @"CREATE TABLE IF NOT EXISTS `canvas_discussion_reply` (
            `id`              INTEGER PRIMARY KEY AUTOINCREMENT,
            `entry_id`        INTEGER,
            `posted_by`       STRING,
            `posted_at`       STRING,
            `message`         STRING NULL,
            UNIQUE(posted_by, entry_id, posted_at)
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

    public const string CLEANUP_SYNC =
        @"DELETE
          FROM          `sync_history`
          WHERE         `course_id` = {0}
          AND           `status`   = '{1}'
          ;";

    public const string REGISTER_NEW_SYNC =
        @"INSERT INTO   `sync_history` (`course_id`, `hash`)
          VALUES        ({0}, '{1}');";

    public const string COMPLETE_NEW_SYNC =
        @"UPDATE    `sync_history`
        SET         `end_timestamp`=CURRENT_TIMESTAMP,
                    `status`='COMPLETE'
        WHERE       `hash`='{0}';";

    public const string QUERY_COURSE_ASSIGNMENTS =
        @"SELECT    `id`,
                    `assignment_id`,
                    `course_id`,
                    `name`,
                    `published`,
                    `muted`,
                    `due_date`,
                    `points_possible`,
                    `position`,
                    `submission_type`
        FROM        `canvas_assignment`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';";

    public const string QUERY_COURSE_DISCUSSIONS =
        @"SELECT    `id`,
                    `discussion_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';";

    public const string QUERY_TILE_DISCUSSIONS =
        @"SELECT    `id`,
                    `discussion_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `tile_id`={0}
        AND         `sync_hash`='{1}';";

    public const string QUERY_TILE_DISCUSSIONS_FOR_USER =
        @"SELECT    `id`,
                    `discussion_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `tile_id`={0}
        AND         `posted_by`='{1}'
        AND         `sync_hash`='{2}';";

    public const string QUERY_DISCUSSION_ENTRIES =
        @"SELECT    `id`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion_entry`
        WHERE       `course_id`={0}
        AND         `discussion_id`={1}
        ;";

    public const string QUERY_DISCUSSION_ENTRIES_FOR_USER =
        @"SELECT    `id`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion_entry`
        WHERE       `course_id`={0}
        AND         `discussion_id`={1}
        AND         `posted_by`='{2}'
        ;";

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
                            `grading_type`,
                            `submission_type`,
                            `sync_hash` )
        VALUES('{0}', {1}, '{2}', {3}, {4}, '{5}', {6}, {7}, {8}, '{9}', '{10}');";

    public const string REGISTER_CANVAS_DISCUSSION =
        @"INSERT INTO   `canvas_discussion`
                        (   `discussion_id`,
                            `course_id`,
                            `title`,
                            `posted_by`,
                            `posted_at`,
                            `message`,
                            `sync_hash` )
        VALUES({0}, {1}, '{2}', '{3}', '{4}', '{5}', '{6}');";

    public const string UPDATE_CANVAS_DISCUSSION =
        @"UPDATE        `canvas_discussion`
        SET             `tile_id`={6}
        WHERE           `discussion_id`={0}
        AND             `course_id`={1}
        AND             `title`='{2}'
        AND             `posted_by`='{3}'
        AND             `posted_at`='{4}'
        AND             `message`='{5}'
        AND             `sync_hash`='{7}';";

    public const string REGISTER_CANVAS_DISCUSSION_ENTRY =
        @"INSERT INTO   `canvas_discussion_entry`
                        (   `course_id`,
                            `discussion_id`,
                            `posted_by`,
                            `posted_at`,
                            `message`)
        VALUES({0}, {1}, '{2}', '{3}', '{4}')
        ON CONFLICT ( `course_id`, `posted_by`, `discussion_id`, `posted_at` )
        DO UPDATE SET `message` = '{4}'
        ;";

    public const string REGISTER_CANVAS_DISCUSSION_REPLY =
        @"INSERT INTO   `canvas_discussion_reply`
                        (   `entry_id`,
                            `posted_by`,
                            `posted_at`,
                            `message` )
        VALUES({0}, '{1}', '{2}', '{3}')
        ON CONFLICT ( `posted_by`, `entry_id`, `posted_at` )
        DO UPDATE SET `message` = '{3}'
        ;";

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
        ORDER BY    `end_timestamp` DESC;";

    public const string QUERY_LATEST_SYNCS_FOR_COURSE =
        @"SELECT    `hash`
        FROM        `sync_history`
        WHERE       `status`='COMPLETE'
        AND         `course_id`={0}
        ORDER BY    `end_timestamp` DESC
        LIMIT       {1};";

    public const string QUERY_OLD_HASHES_FOR_COURSE =
        @"SELECT    `hash`
        FROM        `sync_history`
        WHERE       `status`='COMPLETE'
        AND         `course_id`={0}
        ORDER BY    `end_timestamp` DESC
        LIMIT       -1
        OFFSET      {1};";

    public const string DELETE_OLD_SYNCS_FOR_COURSE =
        @"DELETE
        FROM        `peer_group`
        WHERE       `sync_hash`='{1}';

        DELETE
        FROM        `tile_entry_submission`
        WHERE       `sync_hash`='{1}';

        DELETE
        FROM        `canvas_users`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';

        DELETE
        FROM        `canvas_assignment`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';

        DELETE
        FROM        `canvas_discussion`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';

        DELETE
        FROM        `notifications`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}';

        DELETE
        FROM        `sync_history`
        WHERE       `course_id`={0}
        AND         `hash`='{1}';
        ";

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
        ORDER BY    `name` ASC;";

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
        ORDER BY    `name` ASC;";

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
        FROM        `goal_grade`
        INNER JOIN  `canvas_users`
            ON      `canvas_users`.`login_id`=`goal_grade`.`user_login_id`
        WHERE       `goal_grade`.`course_id`={0}
        AND         `canvas_users`.`sync_hash`='{1}'
        AND         `goal_grade`.`grade`={2};";

    public const string QUERY_USER_GOAL_GRADE =
        @"SELECT    `grade`
        FROM        `goal_grade`
        WHERE       `course_id`={0}
        AND         `user_login_id`='{1}'
        AND         `grade` IS NOT NULL
        LIMIT       1;";
    public const string QUERY_GOAL_GRADES =
        @"SELECT    `grade`,
                    `user_id`,
                    `user_login_id`,
                    `user_name`
        FROM        `goal_grade`
        WHERE       `course_id`={0}
        AND         `grade` IS NOT NULL;";

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
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        INNER JOIN  `tile`
            ON      `tile`.`id`=`tile_entry`.`tile_id`
        INNER JOIN  `layout_tile_group`
            ON      `layout_tile_group`.`id`=`tile`.`group_id`
        WHERE       `layout_tile_group`.`course_id`={0}
        AND         `tile_entry_submission`.`sync_hash`='{1}'
        AND         `tile_entry_submission`.`grade` NOT NULL;";

    public const string QUERY_COURSE_SUBMISSIONS_FOR_STUDENT =
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
        AND         `tile_entry_submission`.`user_login_id`='{1}'
        AND         `tile`.`id`=`tile_entry`.`tile_id`
        AND         `layout_tile_group`.`id`=`tile`.`group_id`
        AND         `layout_column`.`course_id`={0}
        AND         `tile_entry_submission`.`sync_hash`='{2}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_TILE =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        WHERE       `tile_entry`.`tile_id`={0}
        AND         `tile_entry_submission`.`sync_hash`='{1}';";
    public const string QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        WHERE       `tile_entry`.`tile_id`={0}
        AND         `tile_entry_submission`.`user_login_id`='{1}'
        AND         `tile_entry_submission`.`sync_hash`='{2}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER_PEERS =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        INNER JOIN  `peer_group`
            ON      `tile_entry_submission`.`user_login_id`=`peer_group`.`target_login_id`
        WHERE       `tile_entry`.`tile_id`={0}
        AND         `peer_group`.`user_login_id`='{1}'
        AND         `peer_group`.`sync_hash`='{2}'
        AND         `tile_entry_submission`.`sync_hash`='{2}';";

    public const string QUERY_USER_SUBMISSIONS_FOR_USER =
        @"SELECT    `tile_entry_submission`.`id`,
                    `tile_entry_submission`.`entry_id`,
                    `tile_entry_submission`.`user_login_id`,
                    `tile_entry_submission`.`grade`,
                    `tile_entry_submission`.`submitted`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        WHERE       `tile_entry_submission`.`user_login_id`='{0}'
        AND         `tile_entry_submission`.`sync_hash`='{1}';";

    public const string QUERY_USER_PEER_GRADES =
        @"SELECT   `tile`.`id`,
	    CASE `tile`.`content_type`
            WHEN 'BINARY' THEN  AVG(`tile_entry_submission`.`grade`) * 100
            ELSE                AVG(`tile_entry_submission`.`grade`)
       	END average,
	    CASE `tile`.`content_type`
            WHEN 'BINARY' THEN  MIN(`tile_entry_submission`.`grade`) * 100
            ELSE                MIN(`tile_entry_submission`.`grade`)
       	END minimum,
	    CASE `tile`.`content_type`
            WHEN 'BINARY' THEN  MAX(`tile_entry_submission`.`grade`) * 100
            ELSE                MAX(`tile_entry_submission`.`grade`)
       	END maximum,
        `tile_entry`.`title`,
        `tile_entry_submission`.`grade`,
        `tile`.`content_type`
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        INNER JOIN  `tile`
            ON      `tile`.`id`=`tile_entry`.`tile_id`
        INNER JOIN  `layout_tile_group`
            ON      `layout_tile_group`.`id`=`tile`.`group_id`
        INNER JOIN  `peer_group`
            ON      `tile_entry_submission`.`user_login_id`=`peer_group`.`target_login_id`
	    WHERE       `tile`.`content_type` != 'PREDICTION'
	    AND	        `tile`.`content_type` != 'LEARNING_OUTCOMES'
        AND	        `tile`.`tile_type` != 'DISCUSSIONS'
        AND         `layout_tile_group`.`course_id`={0}
        AND         `peer_group`.`user_login_id`='{1}'
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
        FROM        `tile_entry_submission`
        INNER JOIN  `tile_entry`
            ON      `tile_entry_submission`.`entry_id`=`tile_entry`.`id`
        INNER JOIN  `tile`
            ON      `tile`.`id`=`tile_entry`.`tile_id`
        INNER JOIN  `layout_tile_group`
            ON      `layout_tile_group`.`id`=`tile`.`group_id`
        INNER JOIN  `layout_column`
            ON      `layout_tile_group`.`column_id`=`layout_column`.`id`
        WHERE       `layout_column`.`course_id`={0}
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
        @"UPDATE        `tile_entry_submission`
          SET           `sync_hash`='{1}'
          WHERE         `entry_id` IN (
            SELECT      `tile_entry`.`id`
            FROM        `tile`
            INNER JOIN  `tile_entry`
                ON      `tile`.`id`=`tile_entry`.`tile_id`
            INNER JOIN  `layout_tile_group`
                ON      `layout_tile_group`.`id`=`tile`.`group_id`
            WHERE   `layout_tile_group`.`course_id`={0}
            AND     `tile`.`tile_type`='EXTERNAL_DATA'
          );";

    public const string SETUSERCONSENT =
        @"  INSERT INTO `consent`
                        (   `course_id`,
                            `user_id`,
                            `user_login_id`,
                            `user_name`,
                            `granted`   )
            VALUES({0}, {1}, '{2}', '{3}', {4})
            ON CONFLICT (   `user_id`, course_id   )
            DO UPDATE SET `granted` = {4}
        ;";
    public const string REGISTER_USER_CONSENT =
        @"  INSERT INTO `consent`
                        (   `course_id`,
                            `user_id`,
                            `user_login_id`,
                            `user_name`,
                            `granted`   )
            VALUES({0}, {1}, '{2}', '{3}', -1)
            ON CONFLICT (   `user_id`, course_id   )
            DO NOTHING
        ;";

    public const string CREATE_SUBMISSION_META =
        @"INSERT INTO   `tile_entry_submission_meta`
                        (   `submission_id`,
                            `key`,
                            `value`,
                            `sync_hash`)
        VALUES ({0},'{1}','{2}', '{3}');";

    public const string CREATE_MIGRATION =
        @"INSERT INTO   `migrations`
                        (`migration_id`)
          VALUES ('{0}');";

    public const string QUERY_MIGRATIONS =
        @"SELECT    `migration_id`
          FROM      `migrations`
          WHERE     `migration_id`='{0}';";

    public static readonly Dictionary<string, string> MIGRATIONS = new Dictionary<string, string>()
    {
        // {"0001_add_sent_to_notifications",
        // @"ALTER TABLE notifications ADD sent BOOLEAN;"},
    };
}
