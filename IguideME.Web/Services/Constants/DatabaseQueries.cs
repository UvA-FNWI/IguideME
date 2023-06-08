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
            {
                "000_drop_all_old_tables",
                @"
                DROP TABLE peer_group;
                ;"
            }
        };

// //================================ Tables ================================//

    // /------------------------ Course Settings -------------------------/

    /**
     * The course_settings table stores information about the course such as
     * the id, name, etc, as well as some settings:
     *
     *  - accept_list: if true only allow accepted students to use the app .
     *  - require_consent: Whether or not students need to give consent.
     *  - informed_consent: The text that the students are consenting to.
     *  - personalized peers: TODO:
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
            `name`            STRING,
            `order`           INTEGER,
            `column_id`       INTEGER,
            FOREIGN KEY(`column_id`) REFERENCES `layout_columns`(`column_id`)

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
     * - LEARNING_OUTCOMES
     */
    public const string CREATE_TABLE_TILES =
        @"CREATE TABLE IF NOT EXISTS `tiles` (
            `tile_id`         INTEGER PRIMARY KEY AUTOINCREMENT,
            `group_id`        INTEGER,
            `name`            STRING,
            `order`           INTEGER,
            `type`            INTEGER,
            `visible`         BOOLEAN DEFAULT false,
            `notifications`   BOOLEAN DEFAULT false,
            FOREIGN KEY(`group_id`) REFERENCES `tile_groups`(`group_id`),
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`)
        );";

    /**
     * Tile entries are descendants of tiles.
     *
     * Content might be an id of:
     * - "ASSIGNMENT"
     * - "DISCUSSION"
     * - "LEARNING_OUTCOMES"
     */
    public const string CREATE_TABLE_TILE_ENTRIES = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `tile_entries` (
            `tile_id`         INTEGER,
            `content_id`      INTEGER,
            PRIMARY KEY (`tile_id`,`content_id`),
            FOREIGN KEY(`tile_id`) REFERENCES `tiles`(`tile_id`)
        );";


    public const string CREATE_TABLE_SUBMISSIONS = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `submissions` (
            `submission_id`   INTEGER PRIMARY KEY AUTOINCREMENT,
            `assignment_id`   INTEGER,
            `user_id`         STRING,
            `grade`           INTEGER NULL,
            `date`            INTEGER NULL,
            FOREIGN KEY(`assignment_id`) REFERENCES `assignments`(`assignment_id`),
            FOREIGN KEY(`user_id`) REFERENCES `users`(`user_id`)

        );";

    public const string CREATE_TABLE_SUBMISSIONS_META = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `submissions_meta` (
            `submission_id`   INTEGER,
            `key`             STRING,
            `value`           STRING,
            FOREIGN KEY(`submission_id`) REFERENCES `submissions`(`submission_id`)
        );";

    public const string CREATE_TABLE_LEARNING_GOALS = // NOT DONE
        @"CREATE TABLE IF NOT EXISTS `learning_goals` (
            `goal_id`             INTEGER,
            `name`                STRING,
            `assignment_id`       INTEGER,
            `value`               INTEGER,
            `expression`          INTEGER,
            FOREIGN KEY(`assignment_id`) REFERENCES `assignments`(`assignment_id`)
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
    public const string CREATE_TABLE_USER_SETTINGS =
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
     */
    public const string CREATE_TABLE_PEER_GROUPS =
    @"CREATE TABLE IF NOT EXISTS `peer_groups` (
        `tile_id`           INTEGER,
        `goal_grade`        INTEGER,
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
            `user_id`             STRING,
            `grade`               FLOAT,
            `date`                TEXT,
            UNIQUE(course_id, user_id, date)
        );";

    public const string CREATE_TABLE_GRADE_PREDICTION_MODEL_PARAMETER =
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
            FOREIGN KEY(`course_id`) REFERENCES `course_settings`(`course_id`),
            FOREIGN KEY(`author`) REFERENCES `users`(`name`)
        );";

    public const string CREATE_TABLE_SYNC_HISTORY =
        @"CREATE TABLE IF NOT EXISTS `sync_history` (
            `sync_id`         INTEGER PRIMARY KEY,
            `course_id`       INTEGER,
            `end_timestamp`   INTEGER DEFAULT NULL
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

    public const string REGISTER_PREDICTED_GRADE =
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

    public const string REGISTER_USER_PEER = // DO WE KEEP THE USER_IDS???????????
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

        public const string REGISTER_TILE_GROUP =
        @"INSERT INTO       `tile_groups`
                            (
                                `column_id`,
                                `name`,
                                `order`  )
        VALUES(
            @columnID,
            @name,
            @order
        );";

    public const string REGISTER_TILE =
        @"INSERT INTO  `tiles` (
                       `group_id`,
                       `name`,
                       `order`,
                       `type`,
                       `visible`,
                       `notifications`
                    )
        VALUES (
            @groupID,
            @name,
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
        @"INSERT INTO       `goal_requirement`
                            (   `goal_id`,
                                `tile_id`,
                                `entry_id`,
                                `meta_key`,
                                `value`,
                                `expression` )
        VALUES(
            @goalID,
            @tileID,
            @entryID,
            @metaKey,
            @value,
            @expresson
        );";

    public const string REGISTER_TILE_ENTRY =
        @"INSERT INTO       `tile_entries`
                            (   `tile_id`,
                                `title`,
                                `type`,
                                `wildcard` )
        VALUES(
            @tileID,
            @title,
            @type,
            @wildcard
        );";

    public const string REGISTER_NEW_SYNC =
        @"INSERT INTO   `sync_history` (`course_id`, `sync_id`)
          VALUES        (@courseID, @startTimestamp);";

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
        VALUES(
            @assignmentID,
            @courseID,
            @name,
            @published,
            @muted,
            @dueDate,
            @pointsPossible,
            @position,
            @gradingType,
            @submissionType,
            @hash
        );";

    public const string REGISTER_CANVAS_DISCUSSION =
        @"INSERT INTO   `canvas_discussion`
                        (   `discussion_id`,
                            `course_id`,
                            `title`,
                            `posted_by`,
                            `posted_at`,
                            `message`,
                            `sync_hash` )
        VALUES(
            @id,
            @courseID,
            @title,
            @userName,
            @postedAt,
            @message,
            @hash
        );";

    public const string REGISTER_CANVAS_DISCUSSION_ENTRY =
        @"INSERT INTO   `canvas_discussion_entry`
                        (   `course_id`,
                            `discussion_id`,
                            `posted_by`,
                            `posted_at`,
                            `message`)
        VALUES(
            @courseID,
            @topicID,
            @postedBy,
            @postedAt,
            @message
        )
        ON CONFLICT ( `course_id`, `posted_by`, `discussion_id`, `posted_at` )
        DO UPDATE SET `message` = '{4}'
        ;";

    public const string REGISTER_CANVAS_DISCUSSION_REPLY =
        @"INSERT INTO   `discussion_replies`
                        (   `entry_id`,
                            `posted_by`,
                            `posted_at`,
                            `message` )
        VALUES(
            @entryID,
            @userID,
            @postedAt,
            @message
        )
        ON CONFLICT ( `posted_by`, `entry_id`, `posted_at` )
        DO UPDATE SET `message` = '{3}'
        ;";

    public const string REGISTER_USER_FOR_COURSE =
        @"INSERT INTO   `users`
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
        @"INSERT INTO   `submissions`
                        (   `entry_id`,
                            `user_id`,
                            `grade`,
                            `submitted`,
                            `sync_hash` )
        VALUES(
            @entryID,
            @userID,
            @grade,
            @submitted,
            @hash
        );";

/////// WHAT DO WE DO ON CONFLICT HERE??????? user_name EXISTS NO MORE
    public const string REGISTER_USER_SETTINGS =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `goal_grade`,
                            `sync_id`   )
            VALUES(
                @CourseID,
                @UserID,
                @Granted
                @syncID
            )
        ;";
        //     ON CONFLICT (   `user_id`, course_id   )
        //         DO UPDATE SET `user_name` = `excluded`.`user_name`
        // ;";

    public const string SET_USER_CONSENT =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `consent`,
                            `sync_id`   )
            VALUES(
                @courseID,
                @userID,
                @consent,
                @syncID
            )
            ON CONFLICT (   `user_id`, course_id   )
                DO UPDATE SET `consent` = @consent
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
                            `value`,
                            `sync_hash`)
        VALUES (
            @submissionID,
            @key,
            @value,
            @hash
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

    public const string QUERY_GROUP_PEERS = //// DO WE KEEP THIS???
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
        WHERE           `sync_id` IN ('{0}');";

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

    public const string QUERY_LAYOUT_COLUMN =
        @"SELECT    `column_id`,
                    `size`,
                    `order`
        FROM        `layout_columns`
        WHERE       `course_id`=@courseID
        AND         `column_id`=@columnID
        ORDER BY    `position` ASC;";

    /////// WHY DUPLICATE???????
    public const string QUERY_LAYOUT_COLUMNS =
        @"SELECT    `column_id`,
                    `size`,
                    `order`
        FROM        `layout_columns`
        WHERE       `course_id`=@courseID
        ORDER BY    `position` ASC;";

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

    public const string QUERY_ACCEPT_LIST =
        @"SELECT    `user_id`, `accepted`
        FROM        `accept_list`
        WHERE       `course_id`=@courseID;";

    public const string QUERY_TILE_GROUP =
        @"SELECT    `tile_groups`.`group_id`,
                    `tile_groups`.`name`,
                    `tile_groups`.`column_id`,
                    `tile_groups`.`order`
        FROM        `tile_groups`
        INNER JOIN  `layout_columns`
        USING       (`column_id`)        
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `tile_groups`.`group_id`=@groupID;";

    //// AGAIN, WHY TWO OF THEM????????????????
    public const string QUERY_TILE_GROUPS =
        @"SELECT    `tile_groups`.`group_id`,
                    `tile_groups`.`name`,
                    `tile_groups`.`column_id`,
                    `tile_groups`.`order`
        FROM        `tile_groups`
        INNER JOIN  `layout_columns`
        USING       (`column_id`)        
        WHERE       `layout_columns`.`course_id`=@courseID;";

    public const string QUERY_TILE =
        @"SELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`name`,
                    `tiles`.`order`,
                    `tiles`.`type`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `tiles`.`tile_id`=@tileID
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILES =
        @"SSELECT    `tiles`.`tile_id`,
                    `tiles`.`group_id`,
                    `tiles`.`name`,
                    `tiles`.`order`,
                    `tiles`.`type`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        ORDER BY    `tiles`.`order` ASC;";

    public const string QUERY_TILE_NOTIFICATIONS_STATE =
        @"SELECT    `notifications`
        FROM        `tiles`
        WHERE       `tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOALS =
        @"SELECT    `id`,
                    `tile_id`,
                    `title`
        FROM        `learning_goals`
        WHERE       `course_id`=@courseID;";

    public const string QUERY_TILE_LEARNING_GOALS =
        @"SELECT    `id`,
                    `title`
        FROM        `learning_goals`
        WHERE       `course_id`=@courseID
        AND         `tile_id`=@tileID;";

    public const string QUERY_LEARNING_GOAL =
        @"SELECT    `tile_id`,
                    `title`
        FROM        `learning_goals`
        WHERE       `course_id`=@courseID
        AND         `id`=@id;";

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
        WHERE       `goal_id`=@goalID;";

    public const string QUERY_TILE_ENTRIES =
        @"SELECT    `id`,
                    `tile_id`,
                    `title`,
                    `type`,
                    `wildcard`
        FROM        `tile_entries`
        WHERE       `tile_id`=@tileID
        ;";

    public const string QUERY_ENTRIES =  // half done
        @"SELECT    `tile_entries`.`id`,
                    `tile_entries`.`tile_id`,
                    `tile_entries`.`title`,
                    `tile_entries`.`type`,
                    `tile_entries`.`wildcard`
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
        FROM        `submissions`
        INNER JOIN  `submissions_meta`
            ON      `submissions`.`id`=`submissions_meta`.`submission_id`
        WHERE       `submissions`.`entry_id`=@entryID
            ;";

    public const string QUERY_TILE_ENTRY_SUBMISSION_META =
        @"SELECT    `submissions_meta`.`key`,
                    `submissions_meta`.`value`
        FROM        `submissions`
        INNER JOIN  `submissions_meta`
            ON      `submissions`.`id`=`submissions_meta`.`submission_id`
        WHERE       `submissions`.`id`=@entryID
        AND         `submissions_meta`.`sync_hash`=@hash
        ;";

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
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;";

    public const string QUERY_COURSE_DISCUSSIONS =
        @"SELECT    `id`,
                    `discussion_id`,
                    `tile_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;";

    public const string QUERY_TILE_DISCUSSIONS =
        @"SELECT    `id`,
                    `discussion_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `tile_id`=@id
        AND         `sync_hash`=@hash;";

    public const string QUERY_TILE_DISCUSSIONS_FOR_USER =
        @"SELECT    `id`,
                    `discussion_id`,
                    `course_id`,
                    `title`,
                    `posted_by`,
                    `posted_at`,
                    `message`
        FROM        `canvas_discussion`
        WHERE       `tile_id`=@id
        AND         `posted_by`=@userID
        AND         `sync_hash`=@hash;";

    public const string QUERY_DISCUSSION_ENTRIES =
        @"SELECT    `canvas_discussion_entry`.`id`,
                    `canvas_discussion_entry`.`posted_by`,
                    `canvas_discussion_entry`.`posted_at`,
                    `canvas_discussion_entry`.`message`,
                    `canvas_discussion`.`title`
        FROM        `canvas_discussion_entry`
        INNER JOIN  `canvas_discussion`
            ON      `canvas_discussion_entry`.`discussion_id` = `canvas_discussion`.`discussion_id`
        WHERE       `canvas_discussion_entry`.`course_id`=@courseID
        AND         `canvas_discussion_entry`.`discussion_id`=@discussionID
        AND         `canvas_discussion`.`sync_hash`=@hash
        ;";

    public const string QUERY_DISCUSSION_ENTRIES_FOR_USER =
        @"SELECT    `canvas_discussion_entry`.`id`,
                    `canvas_discussion_entry`.`posted_by`,
                    `canvas_discussion_entry`.`posted_at`,
                    `canvas_discussion_entry`.`message`,
                    `canvas_discussion`.`title`
        FROM        `canvas_discussion_entry`
        INNER JOIN  `canvas_discussion`
            ON      `canvas_discussion_entry`.`discussion_id` = `canvas_discussion`.`discussion_id`
        WHERE       `canvas_discussion_entry`.`course_id`=@courseID
        AND         `canvas_discussion_entry`.`discussion_id`=@discussionID
        AND         `canvas_discussion`.`sync_hash`=@hash
        AND         `canvas_discussion_entry`.`posted_by`=@userID
        ;";

    public const string QUERY_DISCUSSION_REPLIES =
        @"SELECT    `discussion_replies`.`id`,
                    `discussion_replies`.`entry_id`,
                    `discussion_replies`.`posted_by`,
                    `discussion_replies`.`posted_at`,
                    `discussion_replies`.`message`,
                    `canvas_discussion`.`title`
        FROM        `discussion_replies`
        INNER JOIN  `canvas_discussion_entry`
            ON      `discussion_replies`.`entry_id`=`canvas_discussion_entry`.`id`
        INNER JOIN  `canvas_discussion`
            ON      `canvas_discussion_entry`.`discussion_id` = `canvas_discussion`.`discussion_id`
        WHERE       `canvas_discussion_entry`.`course_id`=@courseID
        AND         `canvas_discussion_entry`.`discussion_id`=@discussionID
        AND         `canvas_discussion`.`sync_hash`=@hash
        ;";

    public const string QUERY_DISCUSSION_REPLIES_FOR_USER =
        @"SELECT    `discussion_replies`.`id`,
                    `discussion_replies`.`entry_id`,
                    `discussion_replies`.`posted_by`,
                    `discussion_replies`.`posted_at`,
                    `discussion_replies`.`message`,
                    `canvas_discussion`.`title`
        FROM        `discussion_replies`
        INNER JOIN  `canvas_discussion_entry`
            ON      `discussion_replies`.`entry_id`=`canvas_discussion_entry`.`id`
        INNER JOIN  `canvas_discussion`
            ON      `canvas_discussion_entry`.`discussion_id` = `canvas_discussion`.`discussion_id`
        WHERE       `canvas_discussion_entry`.`course_id`=@courseID
        AND         `canvas_discussion_entry`.`discussion_id`=@discussionID
        AND         `canvas_discussion`.`sync_hash`=@hash
        AND         `discussion_replies`.`posted_by`=@userID
        ;";

    public const string QUERY_SYNC_HASHES_FOR_COURSE =
        @"SELECT    `id`,
                    `course_id`,
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
                    `users`.`role`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`={0}
        AND         `users`.`role`=@role
        AND         `student_settings`.`sync_id`=@syncID
        ORDER BY    `users`.`name` ASC;";

    public const string QUERY_USER_ID =
        @"SELECT    `user_id`
        FROM        `users`
        WHERE       `course_id`=@courseID
        AND         `student_number`=@studentNumber
        ORDER BY    `name` ASC
        LIMIT       1;";

    public const string QUERY_USER_FOR_COURSE =
        @"SELECT    `users`.`user_id`,
                    `users`.`student_number`,
                    `users`.`name`,
                    `users`.`sortable_name`,
                    `users`.`role`
        FROM        `users`
        INNER JOIN  `student_settings`
            USING   (`user_id`)
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `users`.`user_id`=@userID
        AND         `student_settings`.`sync_id`=@syncID
        ORDER BY    `users`.`name` ASC
        LIMIT       1;";

    public const string QUERY_USERS_WITH_GOAL_GRADE =
        @"SELECT    `users`.`user_id`,
                    `users`.`studentnumber`,
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

    public const string QUERY_USER_CONSENT =
        @"SELECT    `user_id`,
                    `goal_grade`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `sync_ID`=@syncID
        ;";

    public const string QUERY_CONSENTS =
        @"SELECT    `user_id`,
                    `goal_grade`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `sync_ID`=@syncID
        ;";

    public const string QUERY_GRANTED_CONSENTS =
        @"SELECT    `user_id`,
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `goal_grade` > 0
        AND         `sync_ID`=@syncID
        ;";

    public const string QUERY_USER_GOAL_GRADE =
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

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`='{0}'
        AND         `sync_hash`='{1}';";

    public const string QUERY_COURSE_SUBMISSIONS =  // half done
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`sync_hash`=@hash
        AND         `submissions`.`grade` NOT NULL;";

    public const string QUERY_COURSE_SUBMISSIONS_FOR_STUDENT = //half done
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`,
                    `tiles`,
                    `tile_entries`,
                    `tile_groups`,
                    `layout_columns`
        WHERE       `submissions`.`entry_id`=`tile_entries`.`id`
        AND         `submissions`.`user_id`=@userID
        AND         `tiles`.`id`=`tile_entries`.`tile_id`
        AND         `tile_groups`.`group_id`=`tiles`.`group_id`
        AND         `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`sync_hash`=@hash;";

    public const string QUERY_USER_SUBMISSIONS_FOR_TILE =
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        AND         `submissions`.`sync_hash`=@hash;";
    public const string QUERY_USER_SUBMISSIONS_FOR_TILE_FOR_USER =
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        WHERE       `tile_entries`.`tile_id`=@tileID
        AND         `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash;";

    public const string QUERY_USER_SUBMISSIONS_FOR_USER =
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        WHERE       `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash;";

    public const string QUERY_USER_RESULTS2 = // Half done
        @"SELECT   `tiles`.`tile_id`,
                    `tile_entries`.`title`,
                    `submissions`.`grade`,
                    `tiles`.`type`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
	    AND         `tiles`.`type` != 1
        AND	        `tiles`.`type` != 2
        AND         `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash
	    GROUP BY    `tile_entries`.`id`;";

    public const string QUERY_USER_DISCUSSION_COUNTER = // NOT DONE (not even started)
        @"SELECT        `canvas_discussion`.`tile_id`,
                        SUM(`counter`)

        FROM(SELECT     `canvas_discussion_entry`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `canvas_discussion_entry`
            LEFT JOIN   `discussion_replies`
                ON      `canvas_discussion_entry`.`id` = `discussion_replies`.`entry_id`
            WHERE       `canvas_discussion_entry`.`course_id` = @courseID
            AND         `discussion_replies`.`posted_by` = @userID

            UNION ALL

            SELECT      `canvas_discussion_entry`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `canvas_discussion_entry`
            WHERE       `course_id` = @courseID
            AND         `posted_by` =@userID

            UNION ALL

            SELECT      `canvas_discussion`.`discussion_id`
                AS      `disc_id`,
            COUNT(*)
                AS      `counter`
            FROM        `canvas_discussion`
            INNER JOIN  `users`
                ON      `canvas_discussion`.`posted_by` = `users`.`name`
            WHERE       `canvas_discussion`.`course_id` = @courseID
            AND         `users`.`user_id` =@userID
            AND         `canvas_discussion`.`sync_id` = @syncID
            AND         `users`.`sync_id` = @syncID)

        LEFT JOIN       `canvas_discussion`
            ON          `disc_id` = `canvas_discussion`.`discussion_id`
        WHERE           `disc_id` IS NOT NULL
        AND             `canvas_discussion`.`sync_hash` = @hash;";

    public const string QUERY_PEER_GROUP_RESULTS =
        @"SELECT    `tile_id`,
                    `avg_grade`,
                    `min_grade`,
                    `max_grade`
        FROM        `peer_groups`
        WHERE       `course_id`=@courseID
        AND         `goal_grade`=@goalGrade
        AND         `sync_id`=@syncID;";


    public const string QUERY_GRADE_COMPARISSON_HISTORY =
        @"SELECT    `peer_groups`.`tile_id`,
                    avg(`submissions`.`grade`),
                    `peer_groups`.`avg_grade`,
                    `peer_groups`.`max_grade`,
                    `peer_groups`.`min_grade`,
                    `peer_groups`.`sync_id`
        FROM        `peer_groups`
        INNER JOIN  `submissions`
            USING   (`sync_id`)
        INNER JOIN  `tile_entries`
            USING   (`entry_id`)
            AND     (`tile_id`)
        WHERE       `peer_groups`.`course_id`=@courseID
        AND         `peer_groups`.`goal_grade`=@grade
        AND         `submissions`.`user_id` = @userID
        GROUP BY    `peer_groups`.`tile_id`, `peer_groups`.`sync_id`
        ORDER BY    `peer_groups`.`tile_id`;";


    public const string QUERY_USER_RESULTS = // half done ?
        @"SELECT   `tiles`.`tile_id`,
                    AVG(`grade`),
                    MIN(`grade`),
                    MAX(`grade`)
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            USING   (`tile_id`)
        INNER JOIN  `tile_groups`
            USING   (`group_id`)
        INNER JOIN  `layout_columns`
            USING   (`column_id`)
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash
	    GROUP BY `tiles`.`tile_id`;";

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY_FOR_USER =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`=@antryID
        AND         `user_id`=@userID
        AND         `sync_hash`=@hash;";

    public const string QUERY_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`=@entryID
        AND         `sync_hash`=@hash;";

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

////// WE NEED  TO JOIN THOSE 2 AND INSERT INSTEAD OF UPDATE
    public const string UPDATE_NOTIFICATION_ENABLE = // NOT DONE 
        @"UPDATE    `student_settings`
        SET         `notifications` = @enable
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID;";

    public const string UPDATE_USER_GOAL_GRADE = // NOT DONE
        @"UPDATE    `student_settings`
        SET         `goal_grade` = @grade
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID;";

    public const string UPDATE_LAYOUT_COLUMN =
        @"UPDATE    `layout_columns`
        SET         `size`=@size,
                    `order`=@order
        WHERE       `column_id`=@columnID
        AND         `course_id`=@courseID;";

    public const string UPDATE_CONSENT_FOR_COURSE =
        @"UPDATE    `course_settings`
                    `consent`=@text
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_PEER_GROUP_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `peer_group_size`=@groupSize,
        WHERE       `course_id`=@courseID;";
    public const string UPDATE_NOTIFICATION_DATES_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `notification_dates`=@notificationDates
        WHERE       `course_id`=@courseID;";

    public const string RELEASE_TILE_GROUPS_FROM_COLUMN =
        @"UPDATE   `tile_groups`
        SET         `column_id`=-1
        WHERE       `column_id`=@columnID;";

    public const string UPDATE_ACCEPT_LIST =
        @"UPDATE    `accept_list`
        SET         `accepted`={2}
        WHERE       `course_id`={0} AND `user_id`='{1}';";

    // public const string REQUIRE_ACCEPT_LIST =
    //     @"UPDATE    `course_settings`
    //     SET         `accept_list`=@enabled
    //     WHERE       `course_id`=@courseID;";

    public const string UPDATE_TILE_GROUP =
        @"UPDATE    `tile_groups`
        SET         `column_id`=@columnID,
                    `name`=@name,
                    `order`=@order
        WHERE       `group_id`=@groupID;";

    public const string UPDATE_LEARNING_GOAL =
        @"UPDATE    `learning_goals`
        SET
                    `title`=@title
        WHERE       `id`=@id
        AND         `tile_id`=@tileID
        AND         `course_id`=@courseID;";

    public const string UPDATE_LEARNING_GOAL_REQUIREMENT =
        @"UPDATE    `goal_requirement`
        SET
                    `tile_id`=@tileID,
                    `entry_id`=@entryID,
                    `meta_key`=@metaKey,
                    `value`=@value,
                    `expression`=@expression
        WHERE
                    `id`=@id
        AND
                    `goal_id`=@goalID
        ;";

    public const string UPDATE_TILE =
        @"UPDATE    `tiles`
        SET
                    `group_id`=@groupID,
                    `name`=@name,
                    `order`=@order,
                    `type`=@type,
                    `visible`=@visible,
                    `notifications`=@notifications
        WHERE       `tiles`.`tile_id`=@tileID;";

    public const string COMPLETE_NEW_SYNC =
        @"UPDATE    `sync_history`
        SET         `end_timestamp`=@currentTimestamp
        WHERE       `sync_id`=@startTimestamp;";

    public const string UPDATE_CANVAS_DISCUSSION =
        @"UPDATE        `canvas_discussion`
        SET             `tile_id`=@tileID
        WHERE           `discussion_id`=@id
        AND             `course_id`=@courseID
        AND             `title`=@title
        AND             `posted_by`=@userName
        AND             `posted_at`=@postedAt
        AND             `message`=@message
        AND             `sync_hash`=@hash;";

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

    public const string DELETE_LAYOUT_COLUMN =
        @"DELETE FROM   `layout_columns`
        WHERE           `column_id`=@columnID
        AND             `course_id`=@courseID;";

    public const string RESET_ACCEPT_LIST =
        @"DELETE FROM   `accept_list`
        WHERE           `course_id`=@courseID;";

    public const string DELETE_TILE_GROUP =
        @"DELETE FROM       `tile_groups`
          WHERE             `group_id`=@groupID;";

    public const string DELETE_LEARNING_GOAL =
        @"DELETE FROM       `learning_goals`
          WHERE             `course_id` = @courseID
          AND               `id` = @id;";

    public const string DELETE_GOAL_REQUIREMENTS =
        @"DELETE FROM       `goal_requirement`
          WHERE             `goal_id` = @goalID;";

    public const string DELETE_GOAL_REQUIREMENT =
        @"DELETE FROM       `goal_requirement`
          WHERE             `goal_id` = @goalID
          AND               `id` = @id;";

    public const string DELETE_TILE_ENTRY =
         @"DELETE FROM       `tile_entries`
          WHERE             `id`=@entryID;";

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

    public const string DELETE_OLD_SYNCS_FOR_COURSE = //half done
        @"DELETE
        FROM        `peer_groups`
        WHERE       `sync_id`=@syncID;

        DELETE
        FROM        `submissions`
        WHERE       `sync_id`=@syncID;

        "+
        //@" ///////// Don't we need those data for the historic grade?
        // DELETE
        // FROM        `student_settings`
        // WHERE       `course_id`=@courseID
        // AND         `sync_id`=@syncID;
        // "+
        @"
        DELETE
        FROM        `canvas_assignment`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@syncID;

        DELETE
        FROM        `canvas_discussion`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@syncID;

        DELETE
        FROM        `notifications`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@syncID;

        DELETE
        FROM        `sync_history`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@syncID;
        ";
}
