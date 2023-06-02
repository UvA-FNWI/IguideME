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
                "001_drop_old_peer_group_table",
                @"
                DROP TABLE peer_group
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
            FOREIGN KEY(`submission_id`) REFERENCES `submissions`(`submission_id`)
        );";

    public const string CREATE_TABLE_LEARNING_GOALS =
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
     *  - consent: whether the student gave permission for the use of data.
     *      -   1: permission granted
     *      -   0: user did not submit preferences
     *      -  -1: permission denied
     *
     *  - goal_grade: target grade of the user for the course. Also used to
                      create the peer groups.
     *      -   -1: Grade not set yet.
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
     * `status` values:
     *  - "outperforming peers"
     *  - "closing the gap"
     *  - "more effor required"
     */
    public const string CREATE_TABLE_NOTIFICATIONS =
        @"CREATE TABLE IF NOT EXISTS `notifications` (
            `user_id`             STRING,
            `tile_id`             INTEGER,
            `message`             TEXT,
            `status`              BOOLEAN,
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
            `name`            STRING,
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
            `name`            STRING,
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
        @"INSERT INTO   `course_settings` (`course_id`, `course_name`, `personalized_peers`, `peer_group_size`)
        VALUES (@courseID, @courseName, 0, 5);";

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

    public const string REGISTER_USER_PEER =
    @"INSERT INTO   `peer_groups` (  `course_id`,
                                    `goal_grade`,
                                    `user_ids`,
                                    `tile_id`,
                                    `avg_grade`,
                                    `min_grade`,
                                    `max_grade`,
                                    `sync_hash`)
        VALUES        (
            @courseID,
            @goalGrade,
            @combinedIDs,
            @tileID,
            @avgGrade,
            @minGrade,
            @maxGrade,
            @hash
        );";

    public const string REGISTER_USER_NOTIFICATIONS =
        @"INSERT INTO   `notifications` (   `course_id`,
                                            `user_id`,
                                            `tile_id`,
                                            `status`,
                                            `sent`,
                                            `sync_hash`)
          VALUES        (
            @courseID,
            @userID,
            @tileID,
            @status,
            false,
            @hash
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
                                            `container_width`,
                                            `position`)
        VALUES(
            @courseID,
            @containerWidth,
            @position
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
                            (   `course_id`,
                                `column_id`,
                                `title`,
                                `position`  )
        VALUES(
            @courseID,
            @columnID,
            @title,
            @position
        );";

    public const string REGISTER_TILE =
        @"INSERT INTO  `tiles` (
                       `group_id`,
                       `title`,
                       `position`,
                       `content_type`,
                       `tile_type`,
                       `visible`,
                       `notifications`,
                       `graph_view`,
                       `wildcard`
                    )
        VALUES (
            @groupID,
            @title,
            @position,
            @contentType,
            @tileType,
            @visible,
            @notifications,
            @graph_view,
            @wildcard
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
                                `wildcard`  )
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
        @"INSERT INTO   `canvas_users`
                        (   `course_id`,
                            `studentnumber`,
                            `user_id`,
                            `name`,
                            `sortable_name`,
                            `role`,
                            `sync_hash`)
                VALUES(
                    @courseID,
                    @studentnumber,
                    @userID,
                    @name,
                    @sortableName,
                    @role,
                    @syncHash
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

    public const string REGISTER_USER_SETTINGS =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `user_name`,
                            `consent`,
                            `goal_grade`   )
            VALUES(
                @CourseID,
                @UserID,
                @UserName,
                @Granted,
                -1
            )
            ON CONFLICT (   `user_id`, course_id   )
                DO UPDATE SET `user_name` = `excluded`.`user_name`
        ;";

    public const string SET_USER_CONSENT =
        @"  INSERT INTO `student_settings`
                        (   `course_id`,
                            `user_id`,
                            `user_name`,
                            `consent`   )
            VALUES(
                @courseID,
                @userID,
                @name,
                @consent
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

    public const string QUERY_GROUP_PEERS =
        @"SELECT        `user_ids`
        FROM            `peer_groups`
        WHERE           `course_id`=@courseID
        AND             `goal_grade`=@goalGrade
        AND             `sync_hash`=@hash;";

    public const string QUERY_ALL_NOTIFICATIONS =
        @"SELECT        `user_id`,
                        `tile_id`,
                        `status`,
                        `sent`
        FROM            `notifications`
        WHERE           `course_id`={0}
        AND             `sync_hash` IN ('{1}');";

    public const string QUERY_ALL_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`, `status`, `sent`
        FROM            `notifications`
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
        AND             `sync_hash`=@hash;";

    public const string QUERY_PENDING_USER_NOTIFICATIONS =
        @"SELECT        `tile_id`, `status`
        FROM            `notifications`
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
        AND             `sync_hash`=@hash
        AND             `sent`=false;";

    public const string QUERY_MARK_NOTIFICATIONS_SENT =
        @"UPDATE        `notifications`
        SET             `sent`=true
        WHERE           `course_id`=@courseID
        AND             `user_id`=@userID
        AND             `sync_hash`=@hash;";

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
        @"SELECT    `id`,
                    `container_width`,
                    `position`
        FROM
            `layout_columns`
        WHERE
            `course_id`=@courseID
        AND
            `id`=@columnID
        ORDER BY
            `position` ASC;";

    public const string QUERY_LAYOUT_COLUMNS =
        @"SELECT    `id`,
                    `container_width`,
                    `position`
        FROM
            `layout_columns`
        WHERE
            `course_id`=@courseID
        ORDER BY
            `position` ASC;";

    public const string QUERY_CONSENT_FOR_COURSE =
        @"SELECT    `course_name`, `require_consent`, `informed_consent`, `accept_list`
        FROM        `course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;";

    public const string QUERY_PEER_GROUP_FOR_COURSE =
        @"SELECT    `peer_group_size`, `personalized_peers`
        FROM        `course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;";

    public const string QUERY_PERSONALIZED_PEERS_FOR_COURSE =
        @"SELECT    `personalized_peers`
        FROM        `course_settings`
        WHERE       `course_id`=@courseID
        LIMIT       1;
        ";

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
        @"SELECT    `tile_groups`.`id`,
                    `tile_groups`.`title`,
                    `tile_groups`.`column_id`,
                    `tile_groups`.`position`
        FROM        `tile_groups`
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `tile_groups`.`id`=@id;";

    public const string QUERY_TILE_GROUPS =
        @"SELECT    `tile_groups`.`id`,
                    `tile_groups`.`title`,
                    `tile_groups`.`column_id`,
                    `tile_groups`.`position`
        FROM        `tile_groups`
        WHERE       `tile_groups`.`course_id`=@courseID;";

    public const string QUERY_TILE =
        @"SELECT    `tiles`.`id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`position`,
                    `tiles`.`tile_type`,
                    `tiles`.`content_type`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`,
                    `tiles`.`graph_view`,
                    `tiles`.`wildcard`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `tiles`.`id`=@id
        ORDER BY    `tiles`.`position` ASC;";

    public const string QUERY_TILES =
        @"SELECT    `tiles`.`id`,
                    `tiles`.`group_id`,
                    `tiles`.`title`,
                    `tiles`.`position`,
                    `tiles`.`tile_type`,
                    `tiles`.`content_type`,
                    `tiles`.`visible`,
                    `tiles`.`notifications`,
                    `tiles`.`graph_view`,
                    `tiles`.`wildcard`
        FROM        `tiles`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
        WHERE       `tile_groups`.`course_id`=@courseID
        ORDER BY    `tiles`.`position` ASC;";

    public const string QUERY_TILE_NOTIFICATIONS_STATE =
        @"SELECT    `notifications`
        FROM        `tiles`
        WHERE       `id`=@tileID;";

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

    public const string QUERY_ENTRIES =
        @"SELECT    `tile_entries`.`id`,
                    `tile_entries`.`tile_id`,
                    `tile_entries`.`title`,
                    `tile_entries`.`type`,
                    `tile_entries`.`wildcard`
        FROM        `tile_entries`
        INNER JOIN  `tiles`
            ON      `tiles`.`id`=`tile_entries`.`tile_id`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
        WHERE       `tile_groups`.`course_id`=@courseID
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
        @"SELECT    `id`,
                    `studentnumber`,
                    `user_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`={0}
        AND         `sync_hash`='{1}'
        ORDER BY    `name` ASC;";

    public const string QUERY_USERS_WITH_ROLE_FOR_COURSE =
        @"SELECT    `id`,
                    `studentnumber`,
                    `user_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`=@courseID
        AND         `role`=@role
        AND         `sync_hash`=@hash
        ORDER BY    `name` ASC;";

    public const string QUERY_USER_ID =
        @"SELECT    `user_id`
        FROM        `canvas_users`
        WHERE       `course_id`=@courseID
        AND         `studentnumber`=@id
        AND         `sync_hash`=@hash
        ORDER BY    `name` ASC
        LIMIT       1;";

    public const string QUERY_USER_FOR_COURSE =
        @"SELECT    `id`,
                    `studentnumber`,
                    `user_id`,
                    `name`,
                    `sortable_name`,
                    `role`
        FROM        `canvas_users`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `sync_hash`=@hash
        ORDER BY    `name` ASC
        LIMIT       1;";

    public const string QUERY_USERS_WITH_GOAL_GRADE =
        @"SELECT    `canvas_users`.`id`,
                    `canvas_users`.`studentnumber`,
                    `canvas_users`.`user_id`,
                    `canvas_users`.`name`,
                    `canvas_users`.`sortable_name`,
                    `canvas_users`.`role`
        FROM        `student_settings`
        INNER JOIN  `canvas_users`
            ON      `canvas_users`.`user_id`=`student_settings`.`user_id`
        WHERE       `student_settings`.`course_id`=@courseID
        AND         `canvas_users`.`sync_hash`=@hash
        AND         `student_settings`.`goal_grade`=@goalGrade;";

    public const string QUERY_NOTIFICATIONS_ENABLE =
        @"SELECT    `notifications`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ;";

    public const string QUERY_USER_CONSENT =
        @"SELECT    `user_id`,
                    `consent`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        ;";

    public const string QUERY_CONSENTS =
        @"SELECT    `user_id`,
                    `user_name`,
                    `consent`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        ;";

    public const string QUERY_GRANTED_CONSENTS =
        @"SELECT    `user_id`,
                    `user_name`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `consent`=1
        ;";

    public const string QUERY_USER_GOAL_GRADE =
        @"SELECT    `goal_grade`
        FROM        `student_settings`
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID
        AND         `goal_grade` IS NOT NULL
        ;";
    public const string QUERY_GOAL_GRADES =
        @"SELECT `goal_grade`, `user_id` from `student_settings` WHERE `course_id`=@courseID;";

    public const string QUERY_USER_SUBMISSIONS_FOR_ENTRY =
        @"SELECT    `id`,
                    `entry_id`,
                    `user_id`,
                    `grade`,
                    `submitted`
        FROM        `submissions`
        WHERE       `entry_id`='{0}'
        AND         `sync_hash`='{1}';";

    public const string QUERY_COURSE_SUBMISSIONS =
        @"SELECT    `submissions`.`id`,
                    `submissions`.`entry_id`,
                    `submissions`.`user_id`,
                    `submissions`.`grade`,
                    `submissions`.`submitted`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            ON      `tiles`.`id`=`tile_entries`.`tile_id`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
        WHERE       `tile_groups`.`course_id`=@courseID
        AND         `submissions`.`sync_hash`=@hash
        AND         `submissions`.`grade` NOT NULL;";

    public const string QUERY_COURSE_SUBMISSIONS_FOR_STUDENT =
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
        AND         `tile_groups`.`id`=`tiles`.`group_id`
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

    public const string QUERY_USER_RESULTS2 =
        @"SELECT   `tiles`.`id`,
        `tile_entries`.`title`,
        `submissions`.`grade`,
        `tiles`.`content_type`
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            ON      `tiles`.`id`=`tile_entries`.`tile_id`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
	    WHERE       `tiles`.`content_type` != 'PREDICTION'
	    AND	        `tiles`.`content_type` != 'LEARNING_OUTCOMES'
        AND	        `tiles`.`tile_type` != 'DISCUSSIONS'
        AND         `tile_groups`.`course_id`=@courseID
        AND         `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash
	    GROUP BY    `tile_entries`.`id`;";

    public const string QUERY_USER_DISCUSSION_COUNTER =
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
            INNER JOIN  `canvas_users`
                ON      `canvas_discussion`.`posted_by` = `canvas_users`.`name`
            WHERE       `canvas_discussion`.`course_id` = @courseID
            AND         `canvas_users`.`user_id` =@userID
            AND         `canvas_discussion`.`sync_hash` = @hash
            AND         `canvas_users`.`sync_hash` = @hash)

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
        AND         `sync_hash`=@hash;";


    public const string QUERY_GRADE_COMPARISSON_HISTORY =
        @"SELECT    `peer_groups`.`tile_id`,
                    avg(`submissions`.`grade`),
                    `peer_groups`.`avg_grade`,
                    `peer_groups`.`max_grade`,
                    `peer_groups`.`min_grade`,
                    `peer_groups`.`sync_hash`
        FROM        `peer_groups`
        INNER JOIN  `submissions`
            ON      `submissions`.`sync_hash` = `peer_groups`.`sync_hash`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id` = `tile_entries`.`id`
            AND     `peer_groups`.`tile_id` = `tile_entries`.`tile_id`
        WHERE       `peer_groups`.`course_id`=@courseID
        AND         `peer_groups`.`goal_grade`=@grade
        AND         `submissions`.`user_id` = @userID
        GROUP BY    `peer_groups`.`tile_id`, `peer_groups`.`sync_hash`
        ORDER BY    `peer_groups`.`tile_id`;";


    public const string QUERY_USER_RESULTS =
        @"SELECT   `tiles`.`id`,
	    CASE `tiles`.`content_type`
            WHEN 'BINARY' THEN  AVG(`grade`) * 1
            ELSE                AVG(`grade`)
       	END average,
	    CASE `tiles`.`content_type`
            WHEN 'BINARY' THEN  MIN(`grade`) * 1
            ELSE                MIN(`grade`)
       	END minimum,
	    CASE `tiles`.`content_type`
            WHEN 'BINARY' THEN  MAX(`grade`) * 1
            ELSE                MAX(`grade`)
       	END maximum
        FROM        `submissions`
        INNER JOIN  `tile_entries`
            ON      `submissions`.`entry_id`=`tile_entries`.`id`
        INNER JOIN  `tiles`
            ON      `tiles`.`id`=`tile_entries`.`tile_id`
        INNER JOIN  `tile_groups`
            ON      `tile_groups`.`id`=`tiles`.`group_id`
        INNER JOIN  `layout_columns`
            ON      `tile_groups`.`column_id`=`layout_columns`.`id`
        WHERE       `layout_columns`.`course_id`=@courseID
        AND         `submissions`.`user_id`=@userID
        AND         `submissions`.`sync_hash`=@hash
	    GROUP BY `tiles`.`id`;";

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

    public const string UPDATE_NOTIFICATION_ENABLE =
        @"UPDATE    `student_settings`
        SET         `notifications` = @enable
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID;";

    public const string UPDATE_USER_GOAL_GRADE =
        @"UPDATE    `student_settings`
        SET         `goal_grade` = @grade
        WHERE       `course_id`=@courseID
        AND         `user_id`=@userID;";

    public const string UPDATE_LAYOUT_COLUMN =
        @"UPDATE    `layout_columns`
        SET         `container_width`=@containerWidth,
                    `position`=@position
        WHERE       `id`=@id
        AND         `course_id`=@courseID;";

    public const string UPDATE_CONSENT_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `require_consent`=@requireConsent,
                    `informed_consent`=@text
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_PEER_GROUP_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `peer_group_size`=@groupSize,
                    `personalized_peers`=@personalizedPeers
        WHERE       `course_id`=@courseID;";
    public const string UPDATE_NOTIFICATION_DATES_FOR_COURSE =
        @"UPDATE    `course_settings`
        SET         `notification_dates`=@notificationDates
        WHERE       `course_id`=@courseID;";

    public const string RELEASE_TILE_GROUPS_FROM_COLUMN =
        @"UPDATE   `tile_groups`
        SET         `column_id`=-1
        WHERE       `column_id`=@id
        AND         `course_id`=@courseID;";

    public const string UPDATE_ACCEPT_LIST =
        @"UPDATE    `accept_list`
        SET         `accepted`={2}
        WHERE       `course_id`={0} AND `user_id`='{1}';";

    public const string REQUIRE_ACCEPT_LIST =
        @"UPDATE    `course_settings`
        SET         `accept_list`=@enabled
        WHERE       `course_id`=@courseID;";

    public const string UPDATE_TILE_GROUP =
        @"UPDATE    `tile_groups`
        SET         `column_id`=@columnID,
                    `title`=@title,
                    `position`=@position
        WHERE       `id`=@id;";

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
                    `title`=@title,
                    `position`=@position,
                    `content_type`=@contentType,
                    `tile_type`=@tileType,
                    `visible`=@visible,
                    `notifications`=@notifications,
                    `graph_view`=@graphView,
                    `wildcard`=@wildcard
        WHERE       `tiles`.`id`=@id;";

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

    public const string RECYCLE_EXTERNAL_DATA =
        @"UPDATE        `submissions`
          SET           `sync_hash`=@hash
          WHERE         `entry_id` IN (
            SELECT      `tile_entries`.`id`
            FROM        `tiles`
            INNER JOIN  `tile_entries`
                ON      `tiles`.`id`=`tile_entries`.`tile_id`
            INNER JOIN  `tile_groups`
                ON      `tile_groups`.`id`=`tiles`.`group_id`
            WHERE   `tile_groups`.`course_id`=@courseID
            AND     `tiles`.`tile_type`='EXTERNAL_DATA'
          );";


// //============================ Delete Values =============================//

    public const string DELETE_LAYOUT_COLUMN =
        @"DELETE FROM   `layout_columns`
        WHERE           `id`=@id
        AND             `course_id`=@courseID;";

    public const string RESET_ACCEPT_LIST =
        @"DELETE FROM   `accept_list`
        WHERE           `course_id`=@courseID;";

    public const string DELETE_TILE_GROUP =
        @"DELETE FROM       `tile_groups`
          WHERE             `id`=@id;";

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

    public const string DELETE_OLD_SYNCS_FOR_COURSE =
        @"DELETE
        FROM        `peer_groups`
        WHERE       `sync_hash`=@hash;

        DELETE
        FROM        `submissions`
        WHERE       `sync_hash`=@hash;

        DELETE
        FROM        `canvas_users`
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;

        DELETE
        FROM        `canvas_assignment`
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;

        DELETE
        FROM        `canvas_discussion`
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;

        DELETE
        FROM        `notifications`
        WHERE       `course_id`=@courseID
        AND         `sync_hash`=@hash;

        DELETE
        FROM        `sync_history`
        WHERE       `course_id`=@courseID
        AND         `sync_id`=@startTimestamp;
        ";
}
