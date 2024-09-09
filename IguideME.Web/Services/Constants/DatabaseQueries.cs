using System.Collections.Generic;

public static class DatabaseQueries
{
    /**
     * Dictionary containing migrations to be run. Migrations should have a
     * unique name and a sqlite query and is only run once.
     */
    public static readonly Dictionary<string, string> MIGRATIONS =
        new()
        {
            // {
            // "000_add_alt_column_to_tile",
            // @"
            // ALTER TABLE `tiles` ADD COLUMN `alt`
            // ;"
            // }
        };

    // //================================ Tables ================================//
    /**
     * The accept list table lists all the accepted students if the course is
     * set to have an accept list in the settings.
     */
    public const string CREATE_TABLE_ACCEPT_LIST =
        @"CREATE TABLE IF NOT EXISTS `accept_list` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_id`             STRING,
            `accepted`            BOOLEAN
        );";

    // /------------------------ Course Settings -------------------------/

    /**
     * The course_settings table stores information about the course such as
     * the id, name, etc, as well as some settings:
     *
     *  - consent: The text that the students are consenting to.
     *  - peer_group_size: The minimum peer group size.
     *
     */
    public const string CREATE_TABLE_COURSE_SETTINGS =
        @"CREATE TABLE IF NOT EXISTS `course_settings` (
            `course_id`             INTEGER PRIMARY KEY,
            `name`                  STRING,
            `start_date`            DATE NULL,
            `end_date`              DATE NULL,
            `consent`               TEXT NULL,
            `peer_group_size`       INTEGER DEFAULT 5
        );";

    public const string CREATE_TABLE_NOTIFICATIONS_COURSE_SETTINGS =
        @"CREATE TABLE IF NOT EXISTS `notifications_course_settings` (
            `course_id`           INTEGER PRIMARY KEY,
            `is_range`            BOOLEAN DEFAULT false,
            `selected_days`       TEXT NULL,
            `selected_dates`      TEXT NULL,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    public const string CREATE_INDEX_NOTIFICATIONS_COURSE_SETTINGS =
        @"CREATE INDEX IF NOT EXISTS `index_notifications_course_settings_on_course_id`
            ON `notifications_course_settings` (`course_id`
        );";

    public const string CREATE_TABLE_USER_TRACKER =
        @"CREATE TABLE IF NOT EXISTS `user_tracker` (
            `timestamp`           INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
            `user_id`             STRING NOT NULL,
            `action`              INTEGER NOT NULL CHECK(`action` >= 0 AND `action` <= 5),
            `action_detail`       STRING,
            `session_id`          INTEGER NOT NULL,
            `course_id`           INTEGER NOT NULL,
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
            PRIMARY KEY(`timestamp`, `user_id`, `session_id`)
            UNIQUE(`timestamp`, `user_id`)
        );";

    public const string CREATE_INDEX_USER_TRACKER_USER_ID =
        @"CREATE INDEX IF NOT EXISTS `index_user_id` ON `user_tracker` (`user_id`);";

    public const string CREATE_INDEX_USER_TRACKER_COURSE_ID =
        @"CREATE INDEX IF NOT EXISTS `index_course_id` ON `user_tracker` (`course_id`);";

    /**
     * The user interface can be customized by the course's teachers. The "Tile"
     * visualisation places groups of tiles in columns. The columns are stored
     * in the `layout_columns` table.
     */
    public const string CREATE_TABLE_LAYOUT_COLUMNS =
        @"CREATE TABLE IF NOT EXISTS `layout_columns` (
            `column_id`       INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `size`            STRING,
            `order`           INTEGER,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    /**
     * The `tile_groups` table stores all tile groups. A tile group is
     * a collection of tiles.
     */
    public const string CREATE_TABLE_TILE_GROUPS =
        @"CREATE TABLE IF NOT EXISTS `tile_groups` (
            `group_id`        INTEGER PRIMARY KEY AUTOINCREMENT,
            `title`           STRING,
            `order`           INTEGER,
            `column_id`       INTEGER DEFAULT -1,
            `course_id`       INTEGER,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    // -------------------- Application configuration --------------------

    /**
     * Creates a new table harbouring all configured tiles. Tiles may contain
     * multiple entries, whom's visualisation are dependent on the parent tile.
     * Tiles are assigned groups and can be of varying types containing
     * different types of contents.
     *
     * Tile types:
     * - ASSIGNMENT
     * - DISCUSSION
     * - LEARNING_GOAL
     */
    public const string CREATE_TABLE_TILES =
        @"CREATE TABLE IF NOT EXISTS `tiles` (
            `tile_id`         INTEGER PRIMARY KEY AUTOINCREMENT,
            `group_id`        INTEGER,
            `title`           STRING,
            `order`           INTEGER,
            `type`            INTEGER,
            `weight`          FLOAT default 0.0,
            `grading_type`    INTEGER,
            `alt`             BOOLEAN DEFUALT false,
            `visible`         BOOLEAN DEFAULT false,
            `notifications`   BOOLEAN DEFAULT false,
            FOREIGN KEY(`group_id`) REFERENCES `tile_groups`(`group_id`)
        );";

    /**
     * Tile entries are descendants of tiles.
     *
     * Content might be an id of:
     * - "ASSIGNMENT"
     * - "DISCUSSION"
     * - "LEARNING_GOAL"
     */
    public const string CREATE_TABLE_TILE_ENTRIES =
        @"CREATE TABLE IF NOT EXISTS `tile_entries` (
            `tile_id`         INTEGER,
            `content_id`      INTEGER,
            `weight`          FLOAT DEFAULT 0.0,
            PRIMARY KEY (`tile_id`,`content_id`),
            FOREIGN KEY(`tile_id`) REFERENCES `tiles`(`tile_id`)
        );";

    public const string CREATE_TABLE_SUBMISSIONS =
        @"CREATE TABLE IF NOT EXISTS `submissions` (
            `submission_id`   INTEGER PRIMARY KEY AUTOINCREMENT,
            `assignment_id`   INTEGER,
            `user_id`         STRING,
            `Grade`           FLOAT NULL,
            `date`            INTEGER NULL,
            FOREIGN KEY(`assignment_id`) REFERENCES `assignments`(`assignment_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`),
            UNIQUE (`assignment_id`,`user_id`)
        );";

    public const string CREATE_TABLE_SUBMISSIONS_META =
        @"CREATE TABLE IF NOT EXISTS `submissions_meta` (
            `submission_id`   INTEGER,
            `key`             STRING,
            `value`           STRING,
            PRIMARY KEY (`submission_id`,`key`),
            FOREIGN KEY(`submission_id`) REFERENCES `submissions`(`submission_id`)
        );";

    public const string CREATE_TABLE_LEARNING_GOALS =
        @"CREATE TABLE IF NOT EXISTS `learning_goals` (
            `course_id`           INTEGER,
            `goal_id`             INTEGER PRIMARY KEY AUTOINCREMENT,
            `title`               STRING
        );";

    public const string CREATE_TABLE_GOAL_REQUREMENTS =
        @"CREATE TABLE IF NOT EXISTS `goal_requirements` (
            `requirement_id`      INTEGER PRIMARY KEY AUTOINCREMENT,
            `goal_id`             INTEGER,
            `assignment_id`       INTEGER,
            `expression`          INTEGER,
            `value`               FLOAT,
            FOREIGN KEY(`assignment_id`) REFERENCES `assignments`(`assignment_id`),
            FOREIGN KEY(`goal_id`) REFERENCES `learning_goals`(`goal_id`)
        );";

    // /------------------------- User Settings --------------------------/

    /**
     * The student_settings table stores the users information and their
     * preferences. These preferences include:
     *
     *
     *  - goal_grade: target Grade of the user for the course. Also used to
                      create the peer groups.
     *      -   0: Grade not set yet
     *      -   1-10
     *
     *  - consent:
     *      -1: unspecified
     *       0: denied
     *      +1: granted
     *  - notifications: whether the user wants to receive performance updates.
     *
     *
     * NOTE: consent is stored using the course's internal numeric ID instead of
     * the course code. This is to prevent students whom re-take a course to
     * automatically grant consent.
     *
     */
    public const string CREATE_TABLE_STUDENT_SETTINGS =
        @"CREATE TABLE IF NOT EXISTS `student_settings` (
            `user_id`           STRING,
            `course_id`         INTEGER,
            `predicted_grade`   FLOAT   DEFAULT 0.0,
            `total_grade`       FLOAT   DEFAULT 0.0,
            `goal_grade`        INTEGER DEFAULT 0,
            `consent`           BOOLEAN DEFAULT false,
            `notifications`     BOOLEAN DEFAULT true,
            `sync_id`           INTEGER,
            PRIMARY KEY (`user_id`,`course_id`,`sync_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`),
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`),
            FOREIGN KEY(`sync_id`) REFERENCES `sync_history`(`sync_id`)
        );";

    // /--------------------------- User Data ----------------------------/


    /**
     * The peer_group table stores the groups of peers students in each goal
     * Grade belong to as well as the Grade statistics of that group.
     *
     * user_ids should go away, right?????
     * `component_type` is an enum and it is the type of comparison and it might be:
     *      - Total
     *      - Tile
     *      - Assignment
     *      - Discussion (not implemented yet)
     *      - Learning Goal (not implemented yet)
     */
    public const string CREATE_TABLE_PEER_GROUPS =
        @"CREATE TABLE IF NOT EXISTS `peer_groups` (
            `component_id`      INTEGER,
            `goal_grade`        INTEGER,
            `user_ids`          STRING,
            `avg_grade`         FLOAT,
            `min_grade`         FLOAT,
            `max_grade`         FLOAT,
            `component_type`    INTEGER,
            `sync_id`           INTEGER,
            PRIMARY KEY (`component_id`,`component_type`,`goal_grade`,`sync_id`),
            FOREIGN KEY(`sync_id`) REFERENCES `sync_history`(`sync_id`)
        );";

    /**
     * The tile_grades table stores the tile Grade of each student
     * at any given point in time
     *
     */
    public const string CREATE_TABLE_TILE_GRADES =
        @"CREATE TABLE IF NOT EXISTS `tile_grades` (
            `user_id`           STRING,
            `tile_id`           INTEGER,
            `grade`             FLOAT,
            `sync_id`           INTEGER,
            PRIMARY KEY (`user_id`,`tile_id`,`sync_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`),
            FOREIGN KEY(`tile_id`) REFERENCES `tiles`(`tile_id`),
            FOREIGN KEY(`sync_id`) REFERENCES `sync_history`(`sync_id`)
        );";

    /**
     * The notifications table stores performance notifications for the
     * students. These are not the ones displayed in the student dashboard as
     * well as sent as emails to the students, they are the raw data used to
     * generate those.
     *
     *
     * `status` values is an enum of:
     *  - "outperforming peers"
     *  - "closing the gap"
     *  - "more effor required"
     */
    public const string CREATE_TABLE_NOTIFICATIONS =
        @"CREATE TABLE IF NOT EXISTS `notifications` (
            `user_id`             STRING,
            `tile_id`             INTEGER,
            `status`              INTEGER,
            `sent`              BOOLEAN DEFAULT false,
            `sync_id`             INTEGER,
            PRIMARY KEY (`user_id`,`tile_id`,`sync_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`),
            FOREIGN KEY(`tile_id`) REFERENCES `tiles`(`tile_id`),
            FOREIGN KEY(`sync_id`) REFERENCES `sync_history`(`sync_id`)
        );";

    // /------------------------ Grade Prediction ------------------------/

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL = // NOT TOUCHED
        @"CREATE TABLE IF NOT EXISTS `grade_prediction_model` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `intercept`           FLOAT,
            `enabled`             BOOLEAN
        );";

    // public const string CREATE_TABLE_PREDICTED_GRADE = // NOT NEEDED ANYMORE
    //     @"CREATE TABLE IF NOT EXISTS `predicted_grade` (
    //         `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
    //         `course_id`           INTEGER,
    //         `user_id`             STRING,
    //         `Grade`               FLOAT,
    //         `date`                TEXT,
    //         UNIQUE(course_id, user_id, date)
    //     );";

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER = // NOT TOUCHED
        @"CREATE TABLE IF NOT EXISTS `grade_prediction_model_parameter` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `model_id`            INTEGER,
            `parameter_id`        INTEGER,
            `weight`              FLOAT
        );";

    // /------------------------- Data registry --------------------------/


    public const string CREATE_TABLE_USERS =
        @"CREATE TABLE IF NOT EXISTS `users` (
            `user_id`         STRING PRIMARY KEY,
            `student_number`  INTEGER,
            `name`            STRING,
            `sortable_name`   STRING,
            `role`            INTEGER DEFAULT 0
        );";

    public const string CREATE_TABLE_ASSIGNMENTS =
        @"CREATE TABLE IF NOT EXISTS `assignments` (
            `assignment_id`   INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`       INTEGER,
            `title`           STRING,
            `external_id`     STRING DEFAULT null UNIQUE,
            `published`       BOOLEAN DEFAULT true,
            `muted`           BOOLEAN DEFAULT false,
            `due_date`        INTEGER DEAFULT NULL,
            `max_grade`       INTEGER,
            `grading_type`    INTEGER,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    public const string CREATE_TABLE_DISCUSSIONS =
        @"CREATE TABLE IF NOT EXISTS `discussions` (
            `discussion_id`   INTEGER PRIMARY KEY,
            `course_id`       INTEGER,
            `title`           STRING,
            `author`          STRING,
            `date`            INTEGER,
            `message`         TEXT DEFAULT NULL,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`),
            FOREIGN KEY(`author`) REFERENCES `users`(`name`)
        );";

    public const string CREATE_TABLE_DISCUSSION_ENTRIES =
        @"CREATE TABLE IF NOT EXISTS `discussion_entries` (
            `entry_id`        INTEGER,
            `discussion_id`   INTEGER,
            `parent_id`       INTEGER,
            `course_id`       INTEGER,
            `author`          STRING,
            `date`            INTEGER,
            `message`         TEXT DEFAULT NULL,
            UNIQUE (`parent_id`, `entry_id`),
            FOREIGN KEY(`author`) REFERENCES `users`(`name`)
            FOREIGN KEY(`discussion_id`) REFERENCES `discussions`(`discussion_id`)
        );";

    public const string CREATE_TABLE_SYNC_HISTORY =
        @"CREATE TABLE IF NOT EXISTS `sync_history` (
            `sync_id`         INTEGER PRIMARY KEY,
            `course_id`       INTEGER,
            `end_timestamp`   INTEGER DEFAULT NULL,
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    // /--------------------------- Migrations ---------------------------/

    public const string CREATE_TABLE_MIGRATIONS =
        @"CREATE TABLE IF NOT EXISTS `migrations` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `migration_id`        STRING
        );";

    // //=========================== Register Values ============================//

    public const string REGISTER_COURSE =
        @"INSERT INTO   `course_settings` (`course_id`, `name`)
        VALUES (@courseID, @courseName);";

    // public const string REGISTER_PREDICTED_GRADE =  // DONE , integrated into student_settings
    //     @"INSERT INTO   `predicted_grade` ( `course_id`,
    //                                         `user_id`,
    //                                         `Grade`,
    //                                         `date` )
    //       VALUES        (
    //         @courseID,
    //         @userID,
    //         @Grade,
    //         CURRENT_DATE
    //       )
    //       ON CONFLICT (`course_id`, `user_id`, `date`) DO UPDATE SET `Grade`=`excluded`.`Grade`;";

    public const string REGISTER_USER_PEER =
        @"INSERT INTO   `peer_groups` ( `goal_grade`,
                                        `user_ids`,
                                        `component_id`,
                                        `avg_grade`,
                                        `min_grade`,
                                        `max_grade`,
                                        `component_type`,
                                        `sync_id`)
            VALUES        (
                @goalGrade,
                @combinedIDs,
                @componentID,
                @avgGrade,
                @minGrade,
                @maxGrade,
                @componentType,
                @syncID
            );";

    public const string REGISTER_TILE_GRADE =
        @"INSERT INTO   `tile_grades` ( `user_id`,
                                        `tile_id`,
                                        `grade`,
                                        `sync_id`)
            VALUES        (
                @userID,
                @tileID,
                @Grade,
                @syncID
            )
            ON CONFLICT DO NOTHING;";

    public const string QUERY_TILE_GRADE_FOR_USER =
        @"SELECT    `grade`
          FROM      `tile_grades`
          WHERE     `user_id` = @userID
          AND       `tile_id` = @tileID
          ORDER BY  `sync_id`
            DESC
          LIMIT 1;";
    public const string REGISTER_USER_NOTIFICATIONS =
        @"INSERT INTO   `notifications` (   `user_id`,
                                            `tile_id`,
                                            `status`,
                                            `sync_id`)
          VALUES        (
            @userID,
            @tileID,
            @status,
            @syncID
          );";

    public const string REGISTER_GRADE_PREDICTION_MODEL =
        @"INSERT INTO   `grade_prediction_model` (    `course_id`,
                                                      `intercept`,
                                                      `enabled`    )
          VALUES        (@courseID, @intercept, True);";

    public const string REGISTER_GRADE_PREDICTION_MODEL_PARAMETER =
        @"INSERT INTO   `grade_prediction_model_parameter` (    `model_id`,
                                                                `parameter_id`,
                                                                `weight` )
          VALUES        (
            @modelID,
            @parameterID,
            @weight
          );";

    public const string REGISTER_LAYOUT_COLUMN =
        @"INSERT INTO   `layout_columns` (   `course_id`,
                                            `size`,
                                            `order`)
        VALUES(
            @courseID,
            @size,
            @order
        );";

    public const string REGISTER_TILE_GROUP =
        @"INSERT INTO       `tile_groups`
                            (
                                `title`,
                                `order`,
                                `course_id`  )
        VALUES(
            @title,
            @order,
            @courseID
        );";

    public const string REGISTER_TILE =
        @"INSERT INTO  `tiles` (
                       `group_id`,
                       `title`,
                       `order`,
                       `type`,
                       `weight`,
                       `grading_type`,
                       `alt`,
                       `visible`,
                       `notifications`
                    )
        VALUES (
            @groupID,
            @title,
            @order,
            @type,
            @weight,
            @gradingType,
            @alt,
            @visible,
            @notifications
        );";

    public const string REGISTER_LEARNING_GOAL =
        @"INSERT OR REPLACE
            INTO            `learning_goals`
                            (   `course_id`,
                                `title`  )
        VALUES(
            @courseID,
            @title
        );";

    public const string REGISTER_GOAL_REQUIREMENT =
        @"INSERT INTO       `goal_requirements`
                            (   `goal_id`,
                                `assignment_id`,
                                `expression`,
                                `value`)
        VALUES(
            @goalID,
            @assignmentID,
            @expresson,
            @value
        );";

    public const string REGISTER_TILE_ENTRY =
        @"INSERT INTO       `tile_entries`
                            (   `tile_id`,
                                `content_id`,
                                `weight`)
        VALUES(
            @tileID,
            @contentID,
            @weight
        );";

    public const string REGISTER_NEW_SYNC =
        @"INSERT INTO   `sync_history` (`course_id`, `sync_id`)
          VALUES        (@courseID, @startTimestamp);";

    public const string REGISTER_ASSIGNMENT =
        @"INSERT OR REPLACE
            INTO   `assignments`
                        (   `external_id`,
                            `course_id`,
                            `title`,
                            `published`,
                            `muted`,
                            `due_date`,
                            `max_grade`,
                            `grading_type`)
        VALUES (
            @externalID,
            @courseID,
            @title,
            @published,
            @muted,
            @dueDate,
            @maxGrade,
            @gradingType
        )
        ON CONFLICT (`external_id`) WHERE NOT NULL DO NOTHING";

    public const string REGISTER_DISCUSSION =
        @"INSERT OR REPLACE
            INTO   `discussions`
                        (   `discussion_id`,
                            `course_id`,
                            `title`,
                            `author`,
                            `date`,
                            `message`)
        VALUES(
            @discussionID,
            @courseID,
            @title,
            @authorName,
            @date,
            @message
        );";

    public const string REGISTER_DISCUSSION_ENTRY =
        @"INSERT OR REPLACE
            INTO   `discussion_entries`
                        (   `entry_id`,
                            `discussion_id`,
                            `parent_id`,
                            `course_id`,
                            `author`,
                            `date`,
                            `message` )
        VALUES(
            @entryID,
            @discussionID,
            @parentID,
            @courseID,
            @userID,
            @date,
            @message
        )
        ON CONFLICT ( `parent_id`, `entry_id` )
        DO UPDATE SET `message` = @message
        ;";

    public const string REGISTER_USER_FOR_COURSE =
        @"INSERT OR REPLACE
        INTO        `users`
                        (   `student_number`,
                            `user_id`,
                            `name`,
                            `sortable_name`,
                            `role`)
                VALUES(
                    @studentnumber,
                    @userID,
                    @name,
                    @sortableName,
                    @role
                );";

    public const string REGISTER_USER_SUBMISSION =
        @"INSERT OR REPLACE
            INTO   `submissions`
                        (   `assignment_id`,
                            `user_id`,
                            `Grade`,
                            `date`)
        VALUES(
            @assignmentID,
            @userID,
            @Grade,
            @date
        )
        ;";

    public const string INITIALIZE_STUDENT_SETTINGS =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `sync_id`   )
            VALUES(
                @courseID,
                @userID,
                @syncID
            )
        ;";

    public const string REGISTER_STUDENT_SETTINGS =
        @"  INSERT OR REPLACE
                INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `predicted_grade`,
                            `total_grade`,
                            `goal_grade`,
                            `consent`,
                            `notifications`,
                            `sync_id`   )
            VALUES(
                @CourseID,
                @UserID,
                @PredictedGrade,
                @TotalGrade,
                @GoalGrade,
                @Consent,
                @Notifications,
                @syncID
            )
            ON CONFLICT (`user_id`,`course_id`,`sync_id`)
            DO UPDATE SET   `predicted_grade` = excluded.`predicted_grade`,
                            `total_grade` = excluded.`total_grade`,
                            `goal_grade` = excluded.`goal_grade` ,
                            `consent`= excluded.`consent` ,
                            `notifications`= excluded.`notifications`
        ;";

    public const string REGISTER_EXTERNALDATA =
        @"INSERT INTO   `external_data`
                        (   `course_id`,
                            `tile_id`,
                            `title`,
                            `Grade`,
                            `user_id`   )
        VALUES(
            @courseID,
            @tileID,
            @title,
            @Grade,
            @userID
        )
        ;";

    public const string REGISTER_SUBMISSION_META =
        @"INSERT INTO   `submissions_meta`
                        (   `submission_id`,
                            `key`,
                            `value`)
        VALUES (
            @submissionID,
            @key,
            @value
        );";

    public const string REGISTER_MIGRATION =
        @"INSERT INTO   `migrations`
                        (`migration_id`)
          VALUES (
            @id
          );";

    // //============================= Query Values =============================//

    public const string QUERY_DOES_COURSE_EXIST =
        @"SELECT 1
        FROM course_settings
        WHERE course_id = @courseID;";

    public const string QUERY_COURSE_IDS = @"SELECT `course_id` FROM `course_settings`;";

    public const string QUERY_PREDICTED_GRADES_FOR_USER =
        @"SELECT    `predicted_grade`,
                    `sync_id`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ORDER BY    `sync_id` DESC
        LIMIT       1
        ;";

    public const string QUERY_TOTAL_GRADE_FOR_USER =
        @"SELECT    `total_grade`,
                    `sync_id`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ORDER BY    `sync_id` DESC
        LIMIT       1
        ;";

    public const string QUERY_GROUP_PEERS = //// DO WE KEEP THIS ?????
        @"SELECT        `user_ids`
        FROM            `peer_groups`
        WHERE           `course_id`=@courseID
        AND             `goal_grade`=@goalGrade
        AND             `sync_id`=@syncID;";

    public const string QUERY_ALL_NOTIFICATIONS =
        @"SELECT        `user_id`,
                        `tile_id`,
                        `status`,
                        `sent`
        FROM            `notifications`
        WHERE           `sync_id` IN ({0});";


    public const string QUERY_ALL_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`,
                        `status`,
                        `sent`
        FROM            `notifications`
        WHERE           `user_id`=@userID
        AND             `sync_id`=@syncID;";

    public const string QUERY_PENDING_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`,
                        `status`
        FROM            `notifications`
        WHERE           `user_id`=@userID
        AND             `sync_id`=@syncID
        AND             `sent`=false;";

    public const string QUERY_MARK_NOTIFICATIONS_SENT =
        @"UPDATE        `notifications`
        SET             `sent`= true
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
        AND             `sync_id`=@syncID;";

    public const string QUERY_GRADE_PREDICTION_MODELS_FOR_COURSE =
        @"SELECT    `grade_prediction_model`.`id`,
                    `grade_prediction_model`.`intercept`,
                    `grade_prediction_model`.`enabled`
        FROM        `grade_prediction_model`
        WHERE       `grade_prediction_model`.`course_id`=@courseID;";

    public const string QUERY_GRADE_PREDICTION_MODEL_FOR_COURSE =
        @"SELECT    `grade_prediction_model`.`id`,
                    `grade_prediction_model`.`intercept`
        FROM        `grade_prediction_model`
        WHERE       `grade_prediction_model`.`course_id`=@courseID
        AND         `grade_prediction_model`.`enabled`=True
        LIMIT 1;";

    public const string QUERY_GRADE_PREDICTION_MODEL_PARAMETERS_FOR_MODEL =
        @"SELECT    `grade_prediction_model_parameter`.`id`,
                    `grade_prediction_model_parameter`.`model_id`,
                    `grade_prediction_model_parameter`.`parameter_id`,
                    `grade_prediction_model_parameter`.`weight`
        FROM        `grade_prediction_model_parameter`
        WHERE       `grade_prediction_model_parameter`.`model_id`=@modelID;";

    public const string QUERY_ALL_TILE_GROUPS_IN_LAYOUT_COLUMN =
        @"SELECT    `group_id`
        FROM        `tile_groups`
        INNER JOIN  `layout_columns`
        USING       (`column_id`)
        WHERE       `column_id`=@columnID
        ;";

    public const string QUERY_LAYOUT_COLUMN =
        @"SELECT    `column_id`,
                    `size`,
                    `order`
        FROM        `layout_columns`
        WHERE       `course_id`=@courseID
        AND         `column_id`=@columnID
        ORDER BY    `order` ASC;";

    public const string QUERY_LAYOUT_COLUMNS =
        @"SELECT    `column_id`,
                    `size`,
                    `order`
        FROM        `layout_columns`
        WHERE       `course_id`=@courseID
        ORDER BY    `order` ASC;";

    public const string QUERY_CONSENT_FOR_COURSE =
        @"SELECT    `name`, `consent`
        FROM        `course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;";

    public const string QUERY_PEER_GROUP_FOR_COURSE =
        @"SELECT    `peer_group_size`
        FROM        `course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;";

    public const string QUERY_NOTIFICATION_DATES_FOR_COURSE =
        @"SELECT    `is_range`, `selected_days`, `selected_dates`
        FROM        `notifications_course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;
    ";

    public const string QUERY_TILE_GRADES =
        @"SELECT    `grade`, `tile_id`
        FROM        `tile_grades`
        WHERE       `sync_id`=@syncID
        AND         `user_id`=@userID;";

    public const string QUERY_TILE_GRADE =
        @"SELECT    `grade`
        FROM        `tile_grades`
        WHERE       `tile_id`=@tileID
        AND         `sync_id`=@syncID
        AND         `user_id`=@userID;";

    public const string QUERY_TILE_GRADE_MAX_AND_TYPE =
        @"SELECT
            CASE type
                WHEN 0 THEN 10
                WHEN 1 THEN (
                    (SELECT COUNT(*) FROM `discussions` WHERE `course_id`=@courseID)
                    +
                    (SELECT COUNT(*) FROM `discussion_entries` WHERE `course_id`=@courseID))
                WHEN 2 THEN (
                    SELECT COUNT(*) FROM `learning_goals` WHERE `course_id`=@courseID)
            END,
            `grading_type`
        FROM `tiles`
        WHERE `tile_id`=@tileID
        ;";

    public const string QUERY_TILE_PEER_GRADES =
        @"SELECT    `peer_groups`.`min_grade`,
                    `peer_groups`.`avg_grade`,
                    `peer_groups`.`max_grade`
        FROM        `peer_groups`
        INNER JOIN  `student_settings`
            USING   (`goal_grade`)
        WHERE       `peer_groups`.`component_id`=@tileID
        AND         `peer_groups`.`sync_id`=@syncID
        AND         `peer_groups`.`component_type`=@type
        AND         `student_settings`.`user_id`=@userID;";

    public const string QUERY_TILE_GROUP =
        @"SELECT    `group_id`,
                    `title`,
                    `column_id`,
                    `order`
        FROM        `tile_groups`
        WHERE       `course_id`=@courseID
        AND         `group_id`=@groupID;";

    public const string QUERY_TILE_GROUPS =
        @"SELECT    `group_id`,
                    `title`,
                    `column_id`,
                    `order`
        FROM        `tile_groups`
        WHERE       `course_id`=@courseID
        ORDER BY    `order` ASC;";

    public const string QUERY_TILE =
        @"SELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`order`,
                    `tiles`.`type`,
                    `tiles`.`weight`,
                    `tiles`.`grading_type`,
                    `tiles`.`alt`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `tiles`.`tile_id`=@tileID
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILES =
        @"SELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`order`,
                    `tiles`.`type`,
                    `tiles`.`weight`,
                    `tiles`.`grading_type`,
                    `tiles`.`alt`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILES_FOR_GROUP =
        @"SELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`order`,
                    `tiles`.`type`,
                    `tiles`.`weight`,
                    `tiles`.`grading_type`,
                    `tiles`.`alt`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `tile_groups`.`group_id`=@groupID
        AND         `tiles`.`visible` = 1
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILE_NOTIFICATIONS_STATE =
        @"SELECT    `notifications`
        FROM        `tiles`
        WHERE       `tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOALS =
        @"SELECT    `learning_goals`.`goal_id`,
                    `learning_goals`.`title`
        FROM        `learning_goals`
        WHERE       `learning_goals`.`course_id`=@courseID
        ;";

    public const string QUERY_TILE_LEARNING_GOALS =
        @"SELECT    `learning_goals`.`goal_id`,
                    `learning_goals`.`title`
        FROM        `learning_goals`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `learning_goals`.`goal_id`
        WHERE       `tile_entries`.`tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOAL =
        @"SELECT    `title`
        FROM        `learning_goals`
        WHERE       `goal_id`=@goalID;";

    public const string QUERY_GOAL_REQUIREMENTS =
        @"SELECT    `requirement_id`,
                    `goal_id`,
                    `assignment_id`,
                    `expression`,
                    `value`
        FROM        `goal_requirements`
        WHERE       `goal_id`=@goalID;";

    public const string QUERY_ENTRIES_FOR_TILE =
        @"SELECT    `tile_entries`.`tile_id`,
                    `tile_entries`.`content_id`,
            CASE `tiles`.`type`
                WHEN    0   THEN `assignments`.`title`
                WHEN    1   THEN `discussions`.`title`
                WHEN    2   THEN `learning_goals`.`title`
            END title,
            `tile_entries`.`weight`
        FROM        `tile_entries`
        INNER JOIN  `tiles`
            USING   (`tile_id`)

        LEFT JOIN  `assignments`
            ON      `tiles`.`type` = 0
            AND     `tile_entries`.`content_id` = `assignments`.`assignment_id`

        LEFT JOIN  `discussions`
            ON      `tiles`.`type` = 1
            AND     `tile_entries`.`content_id` = `discussions`.`discussion_id`

        LEFT JOIN  `learning_goals`
            ON      `tiles`.`type` = 2
            AND     `tile_entries`.`content_id` = `learning_goals`.`goal_id`

        WHERE       `tiles`.`tile_id`=@tileID
        ;";

    public const string QUERY_ALL_TILE_ENTRIES =
        @"SELECT    `tile_entries`.`tile_id`,
                    `tile_entries`.`content_id`,
                    `tile_entries`.`weight`
        FROM        `tile_entries`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        ;";

    public const string QUERY_TILE_ENTRY_META_KEYS =
        @"SELECT    DISTINCT(`submissions_meta`.`key`)
        FROM        `submissions_meta`
        WHERE       ``submission_id`=@submissionID
        ;";

    public const string QUERY_TILE_ENTRY_SUBMISSION_META =
        @"SELECT    `submissions_meta`.`key`,
                    `submissions_meta`.`value`
        FROM        `submissions_meta`
        WHERE       ``submission_id`=@submissionID
        ;";

    public const string QUERY_CONTENT_HAS_ENTRY =
        @"SELECT    `content_id`
        FROM        `tile_entries`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        WHERE       `tile_entries`.`content_id`= @assignmentID
        AND         `tiles`.`type`=@contentType
        ;";

    public const string QUERY_ASSIGNMENT_ID_FROM_EXTERNAL =
        @"SELECT    `assignment_id`
        FROM        `assignments`
        WHERE       `course_id`= @courseID
        AND         `external_id`= @externalID
        ;";

    public const string QUERY_COURSE_ASSIGNMENTS =
        @"SELECT    `assignment_id`,
                    `course_id`,
                    `title`,
                    `external_id`,
                    `published`,
                    `muted`,
                    `due_date`,
                    `max_grade`,
                    `grading_type`
        FROM        `assignments`
        WHERE       `course_id`=@courseID
        ;";

    public const string QUERY_ASSIGNMENT =
        @"SELECT    `assignment_id`,
                    `course_id`,
                    `title`,
                    `external_id`,
                    `published`,
                    `muted`,
                    `due_date`,
                    `max_grade`,
                    `grading_type`
        FROM        `assignments`
        WHERE       `course_id`=@courseID
        AND         `assignment_id`=@internalID
        ;";

    public const string QUERY_COURSE_TOPICS =
        @"SELECT    `discussions`.`discussion_id`,
                    `discussions`.`title`,
                    `discussions`.`author`,
                    `discussions`.`date`,
                    `discussions`.`message`
        FROM        `discussions`
        WHERE       `discussions`.`course_id`=@courseID
        ;";

    public const string QUERY_TOPIC_FOR_USER =
        @"SELECT    `discussions`.`discussion_id`,
                    `discussions`.`title`,
                    `discussions`.`author`,
                    `discussions`.`date`,
                    `discussions`.`message`,
                    (SELECT COUNT(*) FROM `discussion_entries` WHERE `discussion_entries`.`discussion_id`=@contentID)
        FROM        `discussions`
        WHERE       `discussions`.`course_id`=@courseID
        AND         `discussions`.`discussion_id`=@contentID
        LIMIT       1
        ;";

    public const string QUERY_COURSE_DISCUSSION_ENTRIES_FOR_USER =
        @"SELECT    `entry_id`,
                    `discussion_id`,
                    `parent_id`,
                    `author`,
                    `date`,
                    `message`
        FROM        `discussion_entries`
        WHERE       `course_id` = @courseID
        AND         `author` = @userID
        ;";

    public const string QUERY_TILE_DISCUSSIONS =
        @"SELECT    `discussions`.`discussion_id`,
                    `discussions`.`course_id`,
                    `discussions`.`title`,
                    `discussions`.`author`,
                    `discussions`.`date`,
                    `discussions`.`message`
        FROM        `discussions`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `discussions`.`discussion_id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        ;";

    public const string QUERY_SYNC_HASHES_FOR_COURSE =
        @"SELECT    `course_id`,
                    `sync_id`,
                    `end_timestamp`
        FROM        `sync_history`
        WHERE       `course_id`=@courseID
        ORDER BY    `end_timestamp` DESC;";

    public const string QUERY_LATEST_SYNCS_FOR_COURSE =
        @"SELECT    `sync_id`
        FROM        `sync_history`
        WHERE       `end_timestamp` IS NOT NULL
        AND         `course_id`=@courseID
        ORDER BY    `end_timestamp` DESC
        LIMIT       @limit;";

    public const string QUERY_SYNCS_SINCE_MOMENT_FOR_COURSE =
        @"SELECT    `sync_id`
        FROM        `sync_history`
        WHERE       `sync_id` > @moment
        AND         `course_id`=@courseID
        ORDER BY    `end_timestamp` DESC
        LIMIT       @limit;";

    public const string QUERY_OLD_HASHES_FOR_COURSE =
        @"SELECT    `sync_id`
        FROM        `sync_history`
        WHERE       `end_timestamp` IS NOT NULL
        AND         `course_id`=@courseID
        ORDER BY    `end_timestamp` DESC
        LIMIT       -1
        OFFSET      @offset;";

    // This is a different way to have the following query.
    // Needs more investigatin as to what is better.
    //
    // public const string QUERY_USERS_WITH_ROLE_FOR_COURSE =
    //     @"SELECT    subtable.`user_id`,
    //                 subtable.`student_number`,
    //                 subtable.`name`,
    //                 subtable.`sortable_name`,
    //                 subtable.`role`,
    //                 subtable.`goal_grade`
    //         FROM (
    //             SELECT  `users`.`user_id`,
    //                     `users`.`student_number`,
    //                     `users`.`name`,
    //                     `users`.`sortable_name`,
    //                     `users`.`role`,
    //                     `student_settings`.`goal_grade`,
    //                     ROW_NUMBER()
    //                         OVER    (PARTITION BY `student_settings`.`user_id`
    //                                 ORDER BY `student_settings`.`sync_id` DESC)
    //                         As sync
    //             FROM        `users`
    //                 LEFT JOIN   `student_settings`
    //                     USING   (`user_id`)
    //             WHERE       `student_settings`.`course_id`= @courseID
    //             AND         `users`.`role`=@role
    //         ) subtable
    //     WHERE       subtable.sync = 1
    //     ORDER BY    subtable.`name` ASC;";

    public const string QUERY_USERS_WITH_ROLE_FOR_COURSE = // no consent //NoTotalAverage
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`
            FROM    `users`
                LEFT JOIN   `student_settings`
                    USING   (`user_id`)
            WHERE       `student_settings`.`course_id`= @courseID
            AND         `users`.`role`= @role
            GROUP BY    `users`.`user_id`
            ORDER BY    `users`.`name` ASC
            ;";

    public const string QUERY_COUNT_USERS =
        @"SELECT    COUNT(*)
        FROM        `users`
        LEFT JOIN   `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id` = @courseID
        AND         `users`.`role` = @role
        ;";

    public const string QUERY_CONSENTED_STUDENTS_FOR_COURSE =
        /// ^^^ WITH CONSENT ^^^ //NoTotalAverage
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`,
                    `student_settings`.`goal_grade`,
                    Max(`student_settings`.`sync_id`)
            FROM    `users`
                LEFT JOIN   `student_settings`
                    USING   (`user_id`)
            WHERE       `student_settings`.`course_id`= @courseID
            AND         `users`.`role`= 0
            AND         `student_settings`.`consent` = true
            GROUP BY    `users`.`user_id`
            ORDER BY    `users`.`name` ASC
            ";

    public const string QUERY_USER_ID =
        @"SELECT    `users`.`user_id`
        FROM        `users`
        WHERE       `users`.`student_number`=@studentNumber
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_USER_ID_FROM_NAME =
        @"SELECT    `users`.`user_id`
        FROM        `users`
        WHERE       `users`.`name`=@name
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_CONSENTED_USER_ID_FROM_STUDENT_NUMBER =
        @"SELECT    `users`.`user_id`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `users`.`student_number`=@studentNumber
        AND         `student_settings`.`consent`= true
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_USER_DATA_FOR_COURSE = // no consent
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`
        FROM        `users`
        WHERE       `users`.`user_id`= @userID;";

    public const string QUERY_CONSENTED_USER_DATA_FOR_COURSE = //// ^^^ WITH CONSENT ^^^ //NoTotalAverage
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`,
                    `student_settings`.`goal_grade`
        FROM        `users`
        LEFT JOIN   `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `users`.`user_id`=@userID
        AND         `student_settings`.`consent` = true
        ORDER BY    `student_settings`.`sync_id` DESC
        LIMIT       1";

    public const string QUERY_STUDENTS_WITH_GOAL_GRADE = //NoTotalAverage
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`,
                    Max(`student_settings`.`sync_id`)
            FROM    `users`
                LEFT JOIN   `student_settings`
                    USING   (`user_id`)
            WHERE       `student_settings`.`course_id`= @courseID
            AND         `student_settings`.`goal_grade`=@goalGrade
            AND         `student_settings`.`consent`= true
            GROUP BY    `users`.`user_id`
            ORDER BY    `users`.`name` ASC
            ;";

    public const string QUERY_STUDENT_IDS_WITH_GOAL_GRADE = //NoTotalAverage
        @"SELECT    `users`.`user_id`,
                    Max(`student_settings`.`sync_id`)
            FROM    `users`
                LEFT JOIN   `student_settings`
                    USING   (`user_id`)
            WHERE       `student_settings`.`course_id`= @courseID
            AND         `student_settings`.`goal_grade`=@goalGrade
            AND         `student_settings`.`consent`= true
            GROUP BY    `users`.`user_id`
            ORDER BY    `users`.`name` ASC
            ;";

    public const string QUERY_NOTIFICATIONS_ENABLE =
        @"SELECT    `notifications`,
                    Max(`student_settings`.`sync_id`)
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `consent` = true
        ;";

    public const string QUERY_GOAL_GRADE_FOR_USER =
        @"SELECT    `goal_grade`,
                    Max(`student_settings`.`sync_id`)
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `consent` = true
        ;";

    public const string QUERY_CONSENT_FOR_USER =
        @"SELECT    `consent`
        FROM        `student_settings`
                    Max(`student_settings`.`sync_id`)
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `consent` = true
        ;";

    public const string QUERY_LAST_STUDENT_SETTINGS =
        @"SELECT    `goal_grade`,
                    `total_grade`,
                    `predicted_grade`,
                    `consent`,
                    `notifications`,
                    `sync_ID`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ORDER BY    `sync_ID` DESC
        LIMIT       1
        ;";

    public const string QUERY_UPDATE_STUDENT_SETTINGS =
        @"UPDATE    `student_settings`
        SET         `sync_ID`=@syncID
        WHERE       `user_id`= @userID
        AND         `course_id`= @courseID
        AND         `sync_ID`= @oldSyncID
        ;";

    public const string QUERY_COURSE_SUBMISSIONS =
        @"SELECT    `submissions`.`submission_id`,
                    `submissions`.`assignment_id`,
                    `submissions`.`user_id`,
                    `submissions`.`Grade`,
                    `submissions`.`date`
        FROM        `submissions`
        INNER JOIN  `assignments`
            USING   (`assignment_id`)
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id`=`assignments`.`assignment_id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `submissions`.`Grade` NOT NULL;";

    public const string QUERY_COURSE_SUBMISSIONS_FOR_STUDENT =
        @"SELECT    `submissions`.`submission_id`,
                    `submissions`.`assignment_id`,
                    `submissions`.`user_id`,
                    `submissions`.`Grade`,
                    `submissions`.`date`
        FROM        `submissions`
        INNER JOIN  `assignments`
            USING   (`assignment_id`)
        WHERE       `assignments`.`course_id`=@courseID
        AND         `submissions`.`user_id`=@userID
        ;";

    public const string QUERY_ALL_USER_SUBMISSIONS_FOR_TILE =
        @"SELECT    `submissions`.`submission_id`,
                    `submissions`.`assignment_id`,
                    `submissions`.`user_id`,
                    `submissions`.`Grade`,
                    `submissions`.`date`
        FROM        `submissions`
        INNER JOIN  `assignments`
            USING   (`assignment_id`)
        INNER JOIN  `tile_entries`
            ON      `assignments`.`assignment_id`=`tile_entries`.`content_id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        ;";
    public const string QUERY_SUBMISSIONS_FOR_TILE_FOR_USER =
        @"SELECT    `submissions`.`submission_id`,
                    `submissions`.`assignment_id`,
                    `submissions`.`user_id`,
                    `submissions`.`Grade`,
                    `submissions`.`date`
        FROM        `submissions`
        INNER JOIN  `assignments`
            USING   (`assignment_id`)
        INNER JOIN  `tile_entries`
            ON      `assignments`.`assignment_id`=`tile_entries`.`content_id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        AND         `submissions`.`user_id`=@userID
        ;";

    public const string QUERY_DISCUSSIONS_COUNTER_FOR_USER =
        @"SELECT (
                SELECT     COUNT(*)
                FROM       `discussions`
                WHERE      `course_id` = @courseID
                AND        `author` = @userID
            )
            +
            (
                SELECT     COUNT(*)
                FROM       `discussion_entries`
                WHERE      `course_id` = @courseID
                AND        `author` = @userID
            )
        ;";

    public const string QUERY_DISCUSSIONS_COUNTER_FOR_USER_FOR_ENTRY =
        @"SELECT     COUNT(*)
        FROM         `discussion_entries`
        WHERE        `discussion_id` = @discussionID
        AND          `author` = @userID
        ;";

    public const string QUERY_PEER_GROUP_RESULTS =
        @"SELECT    `avg_grade`,
                    `min_grade`,
                    `max_grade`
        FROM        `peer_groups`
        WHERE       `goal_grade`= @goalGrade
        AND         `component_type`= @componentType
        AND         `component_id`= @componentID
        AND         `sync_id`= @syncID;";

    public const string QUERY_GRADE_COMPARISSON_HISTORY = // half done ?????
        @"SELECT    `peer_groups`.`component_id`,
                    avg(`submissions`.`Grade`),
                    `peer_groups`.`avg_grade`,
                    `peer_groups`.`max_grade`,
                    `peer_groups`.`min_grade`,
                    `peer_groups`.`sync_id`
        FROM        `peer_groups`
        INNER JOIN  `submissions`
            ON      `peer_groups`.`sync_id` == `submissions`.`date`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`tile_id` == `peer_groups`.`component_id`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `submissions`.`assignment_id`
        WHERE       `peer_groups`.`course_id`=@courseID
        AND         `peer_groups`.`goal_grade`=@Grade
        AND         `peer_groups`.`componentType`= @componentType
        AND         `submissions`.`user_id` = @userID
        GROUP BY    `peer_groups`.`component_id`, `peer_groups`.`sync_id`
        ORDER BY    `peer_groups`.`component_id`;";

    public const string QUERY_USER_SUBMISSION_FOR_ENTRY_FOR_USER =
        @"SELECT    `submission_id`,
                    `assignment_id`,
                    `user_id`,
                    `Grade`,
                    `date`
        FROM        `submissions`
        WHERE       `assignment_id`=@entryID
        AND         `user_id`=@userID
        ;";

    public const string QUERY_ASSIGNMENT_GRADE =
        @"SELECT    `Grade`
        FROM        `submissions`
        WHERE       `assignment_id`=@assignmentID
        AND         `user_id`=@userID
        ;";

    public const string QUERY_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `Grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`=@entryID
        ;";
    public const string QUERY_EXTERNALDATA =
        @"SELECT    `user_id`,
                    `title`,
                    `Grade`
        FROM        `external_data`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `tile_id`=@tileID
        ;";

    public const string QUERY_MIGRATIONS =
        @"SELECT    `migration_id`
          FROM      `migrations`
          WHERE     `migration_id`=@id;";

    // //============================ Update Values =============================//


    public const string UPDATE_LAYOUT_COLUMN =
        @"UPDATE    `layout_columns`
        SET         `size`=@size,
                    `order`=@order
        WHERE       `column_id`=@columnID
        AND         `course_id`=@courseID;";

    public const string UPDATE_CONSENT_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `consent`=@text
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_PEER_GROUP_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `peer_group_size`=@groupSize
        WHERE       `course_id`=@courseID;";
    public const string UPDATE_NOTIFICATION_DATES_FOR_COURSE =
        @"INSERT OR REPLACE
        INTO        `notifications_course_settings`
                    (`course_id`, `is_range`, `selected_days`, `selected_dates`)
        VALUES      (@courseID, @isRange, @selectedDays, @selectedDates);";

    public const string TIE_TILE_GROUP_TO_COLUMN =
        @"UPDATE    `tile_groups`
        SET         `column_id`=@columnID
        WHERE       `group_id`=@groupID;";

    public const string RELEASE_ALL_COURSE_TILE_GROUPS_FROM_COLUMNS =
        @"UPDATE   `tile_groups`
        SET         `column_id`=-1
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_TILE_GROUP =
        @"UPDATE    `tile_groups`
        SET         `column_id`=@columnID,
                    `title`=@title,
                    `order`=@order
        WHERE       `group_id`=@groupID;";

    public const string UPDATE_TILE_GROUP_ORDER =
        @"UPDATE    `tile_groups`
        SET         `order`=@order
        WHERE       `group_id`=@groupID
        ";

    public const string UPDATE_LEARNING_GOAL =
        @"UPDATE    `learning_goals`
        SET         `title`=@title
        WHERE       `goal_id`=@goalID
        AND         `course_id`=@courseID;";

    public const string UPDATE_LEARNING_GOAL_REQUIREMENT =
        @"UPDATE    `goal_requirements`
        SET         `assignment_id`=@assignmentID,
                    `expression`=@expression,
                    `value`=@value
        WHERE       `requirement_id`=@requirementID
        ;";

    public const string UPDATE_TILE =
        @"UPDATE    `tiles`
        SET         `group_id`=@groupID,
                    `title`=@title,
                    `order`=@order,
                    `type`=@type,
                    `weight`=@weight,
                    `grading_type`=@gradingType,
                    `alt`=@alt,
                    `visible`=@visible,
                    `notifications`=@notifications
        WHERE       `tiles`.`tile_id`=@tileID;";

    public const string UPDATE_TILE_ORDER =
        @"UPDATE    `tiles`
        SET         `order`=@order
        WHERE       `tile_id`=@tileID
        ";

    public const string COMPLETE_NEW_SYNC =
        @"UPDATE    `sync_history`
        SET         `end_timestamp`=@currentTimestamp
        WHERE       `sync_id`=@startTimestamp;";

    // I think we should just update it in the tile entry table, right?????
    // public const string UPDATE_discussions =
    //     @"UPDATE        `discussions`
    //     SET             `tile_id`=@tileID
    //     WHERE           `discussion_id`=@id
    //     AND             `course_id`=@courseID
    //     AND             `title`=@title
    //     AND             `posted_by`=@userName
    //     AND             `posted_at`=@postedAt
    //     AND             `message`=@message
    //     AND             `sync_hash`=@hash;";

    // //============================ Delete Values =============================//

    public const string DELETE_ALL_LAYOUT_COLUMNS =
        @"DELETE FROM   `layout_columns`
        WHERE           `course_id`=@courseID;";

    public const string DELETE_TILE =
        @"DELETE FROM   `tiles`
        WHERE `tile_id` = @tileID;";

    public const string DELETE_TILE_GROUP =
        @"DELETE FROM       `tile_groups`
          WHERE             `group_id`=@groupID;";

    public const string DELETE_LEARNING_GOAL =
        @"DELETE FROM       `learning_goals`
          WHERE             `goal_id` = @goalID;";

    public const string DELETE_GOAL_REQUIREMENTS =
        @"DELETE FROM       `goal_requirements`
          WHERE             `goal_id` = @goalID;";

    public const string DELETE_GOAL_REQUIREMENT =
        @"DELETE FROM       `goal_requirements`
          WHERE             `requirement_id` = @requirementID;";

    public const string DELETE_TILE_ENTRY = ////should this stay like this?????
        @"DELETE FROM       `tile_entries`
          WHERE              ROWID=@entryID;";

    public const string DELETE_ALL_TILE_ENTRIES_OF_TILE =
        @"DELETE FROM       `tile_entries`
          WHERE              `tile_id`=@tileID;";

    public const string DELETE_INCOMPLETE_SYNCS =
        @"DELETE
          FROM          `sync_history`
          WHERE         `course_id` = @courseID
          AND           `end_timestamp` IS NULL;";

    public const string GET_TRACKER_SESSION_ID =
        @"SELECT          `session_id`, `timestamp`
          FROM            `user_tracker`
          WHERE           `user_id` = @userID
          AND             `course_id` = @courseID
          ORDER BY        `timestamp` DESC
          LIMIT           1;";

    public const string INSERT_USER_ACTION =
        @"INSERT INTO   `user_tracker` (`user_id`,`action`,`action_detail`,`session_id`,`course_id`)
          VALUES        (
            @userID,
            @action,
            @actionDetail,
            @sessionID,
            @courseID
          );";

    public const string INSERT_USER_ACTION_TEST =
        @"INSERT INTO   `user_tracker` (`user_id`,`action`,`action_detail`,`session_id`,`course_id`)
          VALUES        (
            @userID,
            @action,
            @actionDetail,
            (
            SELECT
                CASE WHEN strftime('%s', 'now') - `timestamp` > 1800 THEN
                    `session_id` + 1
                WHEN COUNT(*) = 0 THEN
                    1
                ELSE
                    `session_id`
                END
            FROM `user_tracker`
            WHERE `user_id`=@userID
            AND   `course_id`=@courseID
            ORDER BY `timestamp` DESC
            LIMIT 1
            ),
            @courseID
          );";

    public const string QUERY_NUMBER_CONSENT_PER_COURSE =
        @"SELECT        COUNT(*)
          FROM          `student_settings`
          WHERE         `course_id` = @courseID
          AND           `sync_id` = @syncID
          ;";

    public const string QUERY_ALL_ACTIONS_PER_COURSE =
        @"SELECT          `timestamp`,
                          `user_id`,
                          `action`,
                          `action_detail`,
                          `session_id`
          FROM            `user_tracker`
          WHERE           `course_id` = @courseID
        ;";

    // TODO: check if change here was ok
    public const string DELETE_OLD_SYNCS_FOR_COURSE = //half done
        @"DELETE
        FROM        `peer_groups`
        WHERE       `sync_id`=@syncID;

        DELETE
        FROM        `notifications`
        WHERE       `sent`= true
        AND         `sync_id`=@syncID;

        DELETE
        FROM        `sync_history`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@syncID;
        ";

    // //============================ Accept List Queries =============================//

    public const string REGISTER_ACCEPTED_STUDENT =
        @"INSERT INTO       `accept_list`
                            (   `course_id`,
                                `user_id`,
                                `accepted`  )
        VALUES(
            @courseID,
            @studentID,
            @accepted
        );";

    public const string QUERY_ACCEPT_LIST =
        @"SELECT    `user_id`, `accepted`
        FROM        `accept_list`
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_ACCEPT_LIST =
        @"UPDATE    `accept_list`
        SET         `accepted`={2}
        WHERE       `course_id`={0} AND `user_id`='{1}';";

    public const string REQUIRE_ACCEPT_LIST =
        @"UPDATE    `course_settings`
        SET         `accept_list`=@enabled
        WHERE       `course_id`=@courseID;";

    public const string RESET_ACCEPT_LIST =
        @"DELETE FROM   `accept_list`
        WHERE           `course_id`=@courseID;";
}
