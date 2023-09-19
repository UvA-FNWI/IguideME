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
                // "000_rename_all_old_tables",
                // @"
                // ALTER TABLE `foo` RENAME TO `bar`;
                // ;"
            // }
        };

// //================================ Tables ================================//

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
            `course_id`           INTEGER PRIMARY KEY,
            `name`                STRING,
            `start_date`          DATE NULL,
            `end_date`            DATE NULL,
            `consent`             TEXT NULL,
            `peer_group_size`     INTEGER DEFAULT 5,
            `notification_dates`  TEXT NULL
        );";

    public const string CREATE_TABLE_USER_TRACKER =
        @"CREATE TABLE IF NOT EXISTS `user_tracker` (
            `timestamp`           INTEGER PRIMARY KEY,
            `user_id`             STRING,
            `action`              STRING,
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)
        );";


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
    public const string CREATE_TABLE_LAYOUT_TILE_GROUPS =
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
            PRIMARY KEY (`tile_id`,`content_id`),
            FOREIGN KEY(`tile_id`) REFERENCES `tiles`(`tile_id`)
        );";


    public const string CREATE_TABLE_SUBMISSIONS =
        @"CREATE TABLE IF NOT EXISTS `submissions` (
            `submission_id`   INTEGER PRIMARY KEY AUTOINCREMENT,
            `assignment_id`   INTEGER,
            `user_id`         STRING,
            `grade`           INTEGER NULL,
            `date`            INTEGER NULL,
            FOREIGN KEY(`assignment_id`) REFERENCES `assignments`(`assignment_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)

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
     *  - goal_grade: target grade of the user for the course. Also used to
                      create the peer groups.
     *      -   -1: Grade not set yet / No consent given.
     *      -   0-10
     *
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
            `predicted_grade`   INTEGER DEFAULT 0,
            `goal_grade`        INTEGER DEFAULT -1,
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
     * grade belong to as well as the grade statistics of that group.
     *
     * user_ids should go away, right?????
     */
    public const string CREATE_TABLE_PEER_GROUPS =
    @"CREATE TABLE IF NOT EXISTS `peer_groups` (
        `tile_id`           INTEGER,
        `goal_grade`        INTEGER,
        `user_ids`          STRING
        `avg_grade`         INTEGER,
        `min_grade`         INTEGER,
        `max_grade`         INTEGER,
        `sync_id`           INTEGER,
        PRIMARY KEY (`tile_id`,`goal_grade`,`sync_id`),
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

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `grade_prediction_model` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `intercept`           FLOAT,
            `enabled`             BOOLEAN
        );";

    public const string CREATE_TABLE_PREDICTED_GRADE = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `predicted_grade` (
            `id`                  INTEGER PRIMARY KEY AUTOINCREMENT,
            `course_id`           INTEGER,
            `user_id`             STRING,
            `grade`               FLOAT,
            `date`                TEXT,
            UNIQUE(course_id, user_id, date)
        );";

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER = // NOT DONE
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
            `assignment_id`   INTEGER PRIMARY KEY,
            `course_id`       INTEGER,
            `title`           STRING,
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

    public const string CREATE_TABLE_DISCUSSION_REPLIES =
        @"CREATE TABLE IF NOT EXISTS `discussion_replies` (
            `reply_id`        INTEGER PRIMARY KEY AUTOINCREMENT,
            `discussion_id`   INTEGER,
            `author`          STRING,
            `date`            INTEGER,
            `message`         TEXT DEFAULT NULL,
            UNIQUE (`discussion_id`,`author`,`date`),
            FOREIGN KEY(`discussion_id`) REFERENCES `discussions`(`discussion_id`),
            FOREIGN KEY(`author`) REFERENCES `users`(`name`)
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

    public const string REGISTER_PREDICTED_GRADE =  // NOT DONE , need to integrate this in student_settings
        @"INSERT INTO   `predicted_grade` ( `course_id`,
                                            `user_id`,
                                            `grade`,
                                            `date` )
          VALUES        (
            @courseID,
            @userID,
            @grade,
            CURRENT_DATE
          )
          ON CONFLICT (`course_id`, `user_id`, `date`) DO UPDATE SET `grade`=`excluded`.`grade`;";

    public const string REGISTER_USER_PEER = // DO WE KEEP THE USER_IDS?????
    @"INSERT INTO   `peer_groups` ( `goal_grade`,
                                    `user_ids`,
                                    `tile_id`,
                                    `avg_grade`,
                                    `min_grade`,
                                    `max_grade`,
                                    `sync_id`)
        VALUES        (
            @goalGrade,
            @combinedIDs,
            @tileID,
            @avgGrade,
            @minGrade,
            @maxGrade,
            @syncID
        );";

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
                       `visible`,
                       `notifications`
                    )
        VALUES (
            @groupID,
            @title,
            @order,
            @type,
            @visible,
            @notifications
        );";


    public const string REGISTER_LEARNING_GOAL =
        @"INSERT INTO       `learning_goals`
                            (   `course_id`,
                                `tile_id`,
                                `title`  )
        VALUES(
            @courseID,
            @tileID,
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
                                `content_id`)
        VALUES(
            @tileID,
            @contentID
        );";

    public const string REGISTER_NEW_SYNC =
        @"INSERT INTO   `sync_history` (`course_id`, `sync_id`)
          VALUES        (@courseID, @startTimestamp);";

    public const string REGISTER_ASSIGNMENT =
        @"INSERT OR REPLACE
            INTO   `assignments`
                        (   `assignment_id`,
                            `course_id`,
                            `title`,
                            `published`,
                            `muted`,
                            `due_date`,
                            `max_grade`,
                            `grading_type`)
        VALUES(
            @assignmentID,
            @courseID,
            @title,
            @published,
            @muted,
            @dueDate,
            @maxGrade,
            @gradingType
        );";

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

    // public const string REGISTER_discussion_replies =
    //     @"INSERT INTO   `discussion_replies`
    //                     (   `course_id`,
    //                         `discussion_id`,
    //                         `posted_by`,
    //                         `posted_at`,
    //                         `message`)
    //     VALUES(
    //         @courseID,
    //         @topicID,
    //         @postedBy,
    //         @postedAt,
    //         @message
    //     )
    //     ON CONFLICT ( `course_id`, `posted_by`, `discussion_id`, `posted_at` )
    //     DO UPDATE SET `message` = '{4}'
    //     ;";

    public const string REGISTER_DISCUSSION_REPLY =
        @"INSERT OR REPLACE
            INTO   `discussion_replies`
                        (   `discussion_id`,
                            `author`,
                            `date`,
                            `message` )
        VALUES(
            @entryID,
            @userID,
            @date,
            @message
        )
        ON CONFLICT ( `discussion_id`, `author`, `date` )
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
                            `grade`,
                            `date`)
        VALUES(
            @assignmentID,
            @userID,
            @grade,
            @date
        )
        ;";

    public const string INITIALIZE_STUDENT_SETTINGS =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `sync_id`   )
            VALUES(
                @CourseID,
                @UserID,
                @syncID
            )
        ;";

    public const string REGISTER_STUDENT_SETTINGS =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `predicted_grade`,
                            `goal_grade`,
                            `notifications`
                            `sync_id`   )
            VALUES(
                @CourseID,
                @UserID,
                @PredictedGrade,
                @GoalGrade,
                @Notifications,
                @syncID
            )
        ;";

    public const string REGISTER_EXTERNALDATA =
        @"INSERT INTO   `external_data`
                        (   `course_id`,
                            `tile_id`,
                            `title`,
                            `grade`,
                            `user_id`   )
        VALUES(
            @courseID,
            @tileID,
            @title,
            @grade,
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

    public const string QUERY_COURSE_IDS =
        @"SELECT `course_id` FROM `course_settings`;";

    public const string QUERY_PREDICTED_GRADES_FOR_USER =
        @"SELECT    `user_id`,
                    `date`,
                    `grade`
        FROM        `predicted_grade`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ORDER BY    `date` DESC;";

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
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
        AND             `sync_id`=@syncID;";

    public const string QUERY_PENDING_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`,
                        `status`
        FROM            `notifications`
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
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

    /////// WHY DUPLICATE?????
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

    // public const string QUERY_PERSONALIZED_PEERS_FOR_COURSE =
    //     @"SELECT    `personalized_peers`
    //     FROM        `course_settings`
    //     WHERE       `course_id`=@courseID
    //     LIMIT       1;
    //     ";

    public const string QUERY_NOTIFICATION_DATES_FOR_COURSE =
    @"SELECT    `notification_dates`
    FROM        `course_settings`
    WHERE       `course_id`=@courseID
    LIMIT       1;
    ";

    public const string QUERY_TILE_GROUP =
        @"SELECT    `group_id`,
                    `title`,
                    `column_id`,
                    `order`
        FROM        `tile_groups`
        WHERE       `course_id`=@courseID
        AND         `group_id`=@groupID;";

    //// AGAIN, WHY TWO OF THEM?????
    public const string QUERY_TILE_GROUPS =
        @"SELECT    `group_id`,
                    `title`,
                    `column_id`,
                    `order`
        FROM        `tile_groups`
        WHERE       `course_id`=@courseID;";

    public const string QUERY_TILE =
        @"SELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`order`,
                    `tiles`.`type`,
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
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILE_NOTIFICATIONS_STATE =
        @"SELECT    `notifications`
        FROM        `tiles`
        WHERE       `tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOALS =
        @"SELECT    `learning_goals`.`goal_id`,
                    `learning_goals`.`title`
        FROM        `learning_goals`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `learning_goals`.`goal_id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        WHERE       `tile_groups`.`course_id`=@courseID
        ;";

    public const string QUERY_TILE_LEARNING_GOALS =
        @"SELECT    `learning_goals`.`goal_id`,
                    `learning_goals`.`title`
        FROM        `learning_goals`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `learning_goals`.`goal_id`
        WHERE       `tile_entries`.`tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOAL =
        @"SELECT    `tile_id`,
                    `title`
        FROM        `learning_goals`
        AND         `goal_id`=@goalID;";

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
            END title
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
                    `tile_entries`.`content_id`
        FROM        `tile_entries`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
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

    public const string QUERY_COURSE_ASSIGNMENTS =
        @"SELECT    `assignment_id`,
                    `course_id`,
                    `title`,
                    `published`,
                    `muted`,
                    `due_date`,
                    `max_grade`,
                    `grading_type`
        FROM        `assignments`
        WHERE       `course_id`=@courseID
        ;";

    public const string QUERY_COURSE_DISCUSSIONS =
        @"SELECT    `discussions`.`discussion_id`,
                    `tile_entries`.`tile_id`,
                    `discussions`.`course_id`,
                    `discussions`.`title`,
                    `discussions`.`author`,
                    `discussions`.`date`,
                    `discussions`.`message`
        FROM        `discussions`
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `discussions`.`discussion_id`
        WHERE       `discussions`.`course_id`=@courseID
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

// NOT USED ANYWHERE. DO WE WANT IT?????
    // public const string QUERY_TILE_DISCUSSIONS_FOR_USER =
    //     @"SELECT    `id`,
    //                 `discussion_id`,
    //                 `course_id`,
    //                 `title`,
    //                 `posted_by`,
    //                 `posted_at`,
    //                 `message`
    //     FROM        `discussions`
    //     WHERE       `tile_id`=@id
    //     AND         `posted_by`=@userID
    //     AND         `sync_hash`=@hash;";

    public const string QUERY_DISCUSSION_ENTRIES =
        @"SELECT    `discussion_replies`.`reply_id`,
                    `discussion_replies`.`author`,
                    `discussion_replies`.`date`,
                    `discussion_replies`.`message`,
                    `discussions`.`title`,
                    `discussions`.`course_id`
        FROM        `discussion_replies`
        INNER JOIN  `discussions`
            USING   (`discussion_id`)
        WHERE       `discussion_replies`.`discussion_id`=@discussionID
        ;";

    public const string QUERY_DISCUSSION_ENTRIES_FOR_USER =
        @"SELECT    `discussion_replies`.`reply_id`,
                    `discussion_replies`.`author`,
                    `discussion_replies`.`date`,
                    `discussion_replies`.`message`,
                    `discussions`.`title`
                    `discussions`.`course_id`
        FROM        `discussion_replies`
        INNER JOIN  `discussions`
            USING   (`discussion_id`)
        WHERE       `discussion_replies`.`discussion_id`=@discussionID
        AND         `discussion_replies`.`author`=@userID
        ;";

    public const string QUERY_DISCUSSION_REPLIES =
        @"SELECT    rep.`discussion_replies`.`reply_id`,
                    rep.`discussion_replies`.`author`,
                    rep.`discussion_replies`.`date`,
                    rep.`discussion_replies`.`message`,
                    `discussions`.`title`,
                    `discussions`.`course_id`
        FROM        `discussion_replies` rep
        INNER JOIN  `discussion_replies` ent
            ON      rep.`discussion_id` == ent.`reply_id`
        INNER JOIN  `discussions`
            ON      `discussions`.`discussion_id` == ent.`discussion_id`
        WHERE       ent.`discussion_id`=@discussionID
        ;";

    public const string QUERY_DISCUSSION_REPLIES_FOR_USER =
        @"SELECT    rep.`discussion_replies`.`reply_id`,
                    rep.`discussion_replies`.`author`,
                    rep.`discussion_replies`.`date`,
                    rep.`discussion_replies`.`message`,
                    `discussions`.`title`,
                    `discussions`.`course_id`
        FROM        `discussion_replies` rep
        INNER JOIN  `discussion_replies` ent
            ON      rep.`discussion_id` == ent.`reply_id`
        INNER JOIN  `discussions`
            ON      `discussions`.`discussion_id` == ent.`discussion_id`
        WHERE       ent.`discussion_id`=@discussionID
        AND         rep.`author`=@userID
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

    public const string QUERY_OLD_HASHES_FOR_COURSE =
        @"SELECT    `sync_id`
        FROM        `sync_history`
        WHERE       `end_timestamp` IS NOT NULL
        AND         `course_id`=@courseID
        ORDER BY    `end_timestamp` DESC
        LIMIT       -1
        OFFSET      @offset;";

    public const string QUERY_USERS_FOR_COURSE =
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`={0}
        AND         `student_settings`.`sync_id`='{1}'
        ORDER BY    `users`.`name` ASC;";

    public const string QUERY_USERS_WITH_ROLE_FOR_COURSE =
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
        AND         `users`.`role`=@role
        AND         `student_settings`.`sync_id`=@syncID
        ORDER BY    `users`.`name` ASC;";

    public const string QUERY_CONSENTED_USERS_WITH_ROLE_FOR_COURSE =
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
        AND         `users`.`role`=@role
        AND         `student_settings`.`goal_grade` > 0
        AND         `student_settings`.`sync_id`=@syncID
        ORDER BY    `users`.`name` ASC;";

    public const string QUERY_USER_ID =
        @"SELECT    `users`.`user_id`
        FROM        `users`
        WHERE       `users`.`student_number`=@studentNumber
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_STUDENT_ID =
        @"SELECT    `users`.`user_id`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `users`.`student_number`=@studentNumber
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_USER =
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`,
                    `student_settings`.`goal_grade`
        FROM        `users`
        LEFT JOIN   `student_settings`
            USING   (`user_id`)
        WHERE       `users`.`user_id`=@userID";

    public const string QUERY_USER_FOR_COURSE =
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
        AND         `student_settings`.`sync_id`=@syncID
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_USERS_WITH_GOAL_GRADE =
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `student_settings`.`sync_ID`=@syncID
        AND         `student_settings`.`goal_grade`=@goalGrade;";

    public const string QUERY_NOTIFICATIONS_ENABLE =
        @"SELECT    `notifications`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `sync_ID`=@syncID
        ;";

    public const string QUERY_GOAL_GRADE_FOR_USER =
        @"SELECT    `goal_grade`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `sync_ID`=@syncID
        ;";
    public const string QUERY_GOAL_GRADES =
        @"SELECT    `goal_grade`,
                    `user_id`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `sync_ID`=@syncID
        ;";

    // public const string QUERY_LAST_STUDENT_SETTINGS =
    //     @"SELECT    `predicted_grade`,
    //                 `goal_grade`,
    //                 `notifications`,
    //                 `sync_ID`
    //     FROM        `student_settings`
    //     WHERE       `course_id`=@courseID
    //     AND         `user_id`=@userID
    //     ORDER BY    `sync_ID` DESC
    //     LIMIT       1
    //     ;";
    public const string QUERY_LAST_STUDENT_SETTINGS =
        @"SELECT    `sync_ID`
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
                    `submissions`.`grade`,
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
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`grade` NOT NULL;";

    public const string QUERY_COURSE_SUBMISSIONS_FOR_STUDENT =
        @"SELECT    `submissions`.`submission_id`,
                    `submissions`.`assignment_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
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
                    `submissions`.`grade`,
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
                    `submissions`.`grade`,
                    `submissions`.`date`
        FROM        `submissions`
        INNER JOIN  `assignments`
            USING   (`assignment_id`)
        INNER JOIN  `tile_entries`
            ON      `assignments`.`assignment_id`=`tile_entries`.`content_id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        AND         `submissions`.`user_id`=@userID
        ;";



    public const string QUERY_USER_DISCUSSION_COUNTER = // NOT DONE (not even started)
        @"SELECT        `discussions`.`tile_id`,
                        SUM(`counter`)

        FROM(SELECT     `discussion_replies`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `discussion_replies`
            LEFT JOIN   `discussion_replies`
                ON      `discussion_replies`.`id` = `discussion_replies`.`entry_id`
            WHERE       `discussion_replies`.`course_id` = @courseID
            AND         `discussion_replies`.`posted_by` = @userID

            UNION ALL

            SELECT      `discussion_replies`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `discussion_replies`
            WHERE       `course_id` = @courseID
            AND         `posted_by` =@userID

            UNION ALL

            SELECT      `discussions`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `discussions`
            INNER JOIN  `users`
                ON      `discussions`.`posted_by` = `users`.`name`
            WHERE       `discussions`.`course_id` = @courseID
            AND         `users`.`user_id` =@userID
            AND         `discussions`.`sync_id` = @syncID
            AND         `users`.`sync_id` = @syncID)

        INNER JOIN       `discussions`
            ON          `disc_id` = `discussions`.`discussion_id`
        WHERE           `disc_id` IS NOT NULL
        ;";

    public const string QUERY_PEER_GROUP_RESULTS =
        @"SELECT    `tile_id`,
                    `avg_grade`,
                    `min_grade`,
                    `max_grade`
        FROM        `peer_groups`
        WHERE       `course_id`=@courseID
        AND         `goal_grade`=@goalGrade
        AND         `sync_id`=@syncID;";


    public const string QUERY_GRADE_COMPARISSON_HISTORY = // half done ?????
        @"SELECT    `peer_groups`.`tile_id`,
                    avg(`submissions`.`grade`),
                    `peer_groups`.`avg_grade`,
                    `peer_groups`.`max_grade`,
                    `peer_groups`.`min_grade`,
                    `peer_groups`.`sync_id`
        FROM        `peer_groups`
        INNER JOIN  `submissions`
            ON      `peer_groups`.`sync_id` == `submissions`.`date`
        INNER JOIN  `tile_entries`
            USING   (`tile_id`)
        INNER JOIN  `tile_entries`
            ON      `tile_entries`.`content_id` == `submissions`.`assignment_id`
        WHERE       `peer_groups`.`course_id`=@courseID
        AND         `peer_groups`.`goal_grade`=@grade
        AND         `submissions`.`user_id` = @userID
        GROUP BY    `peer_groups`.`tile_id`, `peer_groups`.`sync_id`
        ORDER BY    `peer_groups`.`tile_id`;";


    public const string QUERY_USER_RESULTS = // half done , does it work though?????
        @"SELECT   `tiles`.`tile_id`,
                    AVG(`grade`),
                    MIN(`grade`),
                    MAX(`grade`)
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`assignment_id`=`tile_entries`.`content_id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`user_id`=@userID
	    GROUP BY `tiles`.`tile_id`;";

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`=@entryID
        AND         `user_id`=@userID
        ;";

    public const string QUERY_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`=@entryID
        ;";
        // AND         `sync_hash`=@hash

    public const string QUERY_EXTERNALDATA =
        @"SELECT    `user_id`,
                    `title`,
                    `grade`
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
        @"UPDATE    `course_settings`
        SET         `notification_dates`=@notificationDates
        WHERE       `course_id`=@courseID;";

    public const string TIE_TILE_GROUP_TO_COLUMN =
        @"UPDATE   `tile_groups`
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

    public const string UPDATE_LEARNING_GOAL =
        @"UPDATE    `learning_goals`
        SET         `title`=@title
        WHERE       `goal_id`=@goalID
        AND         `tile_id`=@tileID
        AND         `course_id`=@courseID;";

    public const string UPDATE_LEARNING_GOAL_REQUIREMENT =
        @"UPDATE    `goal_requirements`
        SET         `assignment_id`=@assignmentID,
                    `expression`=@expression,
                    `value`=@value,
        WHERE       `requirement_id`=@requirementID
        ;";

    public const string UPDATE_TILE =
        @"UPDATE    `tiles`
        SET         `group_id`=@groupID,
                    `title`=@title,
                    `order`=@order,
                    `type`=@type,
                    `visible`=@visible,
                    `notifications`=@notifications
        WHERE       `tiles`.`tile_id`=@tileID;";

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

///// EXTERNAL DATA EXISTS NO MORE, WHAT DO WE DO HERE?????
    public const string RECYCLE_EXTERNAL_DATA =
        @"UPDATE        `submissions`
          SET           `sync_hash`=@hash
          WHERE         `entry_id` IN (
            SELECT      `tile_entries`.`entry_id`
            FROM        `tiles`
            INNER JOIN  `tile_entries`
                USING   (`tile_id`)
            INNER JOIN  `tile_groups`
                USING   (`group_id`)
            INNER JOIN  `layout_columns`
                USING   (`column_id`)
            WHERE       `layout_columns`.`course_id`=@courseID
            AND     `tiles`.`type`='EXTERNAL_DATA'
          );";


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

    public const string DELETE_INCOMPLETE_SYNCS =
        @"DELETE
          FROM          `sync_history`
          WHERE         `course_id` = @courseID
          AND           `end_timestamp` IS NULL;";


    public const string INSERT_USER_ACTION =
    @"INSERT INTO   `user_tracker` (`user_id`,`action`)
          VALUES        (
            @userID,
            @action
          );";

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

    // public const string REGISTER_ACCEPTED_STUDENT =
    //     @"INSERT INTO       `accept_list`
    //                         (   `course_id`,
    //                             `user_id`,
    //                             `accepted`  )
    //     VALUES(
    //         @courseID,
    //         @studentID,
    //         @accepted
    //     );";

    // public const string QUERY_ACCEPT_LIST =
    //     @"SELECT    `user_id`, `accepted`
    //     FROM        `accept_list`
    //     WHERE       `course_id`=@courseID;";

    // public const string UPDATE_ACCEPT_LIST =
    //     @"UPDATE    `accept_list`
    //     SET         `accepted`={2}
    //     WHERE       `course_id`={0} AND `user_id`='{1}';";

    // public const string REQUIRE_ACCEPT_LIST =
    //     @"UPDATE    `course_settings`
    //     SET         `accept_list`=@enabled
    //     WHERE       `course_id`=@courseID;";

    // public const string RESET_ACCEPT_LIST =
    //     @"DELETE FROM   `accept_list`
    //     WHERE           `course_id`=@courseID;";
}
