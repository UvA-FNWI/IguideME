export interface LayoutColumn {
	id: number;
	width: number;
	position: number;
	groups: number[];
}

export interface TileGroup {
	id: number;
	title: string;
	position: number;
}

export interface Tile {
	id: number;
	group_id: number;
	title: string;
	position: number;
	type: TileType;
	weight: number;
	visible: boolean;
	notifications: boolean;
	gradingType: GradingType;
	entries: TileEntries;
}

export enum TileType {
	assignments,
	discussions,
	learning_outcomes,
}

export type TileEntries = Assignment[] | Discussion[] | LearningGoal[];

export interface Assignment {
	id: number;
	course_id: number;
	title: string;
	published: boolean;
	muted: boolean;
	due_date: number;
	max_grade: number;
	grading_type: GradingType;
}

export interface Discussion {
	id: number;
	type: DiscussionType;
	parent_id: number;
	course_id: number;
	title: string;
	author: string;
	date: number;
	message: string;
}

export interface LearningGoal {
	id: number;
	tile_id: number;
	title: string;
	requirements: GoalRequirements[];
}

export enum GradingType {
	PassFail,
	Percentage,
	Letters,
	GPA,
	Points,
	NotGraded,
}

export enum DiscussionType {
	Topic,
	Entry,
	Reply,
}

export enum LogicalExpression {
	Less,
	LessEqual,
	Equal,
	GreaterEqual,
	Greater,
	NotEqual,
}

export interface GoalRequirements {
	id: number;
	goal_id: number;
	tile_id: number;
	assignment_id: number;
	value: number;
	expression: LogicalExpression;
}
