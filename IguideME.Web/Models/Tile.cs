using System.Collections.Generic;
using IguideME.Web.Models.App;
using Newtonsoft.Json;

namespace IguideME.Web.Models
{

	public class TilesGrades
	{

		[JsonProperty(PropertyName = "tile_id")]
		public int tile_id { get; set; }
		[JsonProperty(PropertyName = "grade")]
		public double grade { get; set; }
		[JsonProperty(PropertyName = "max")]
		public double max { get; set; }
		public TilesGrades(int id, double grade, double max)
		{
			this.tile_id = id;
			this.grade = grade;
			this.max = max;

		}
	}

	public class UserTileGrades
	{
		[JsonProperty(PropertyName = "userID")]
		public string userID { get; set; }

		[JsonProperty(PropertyName = "tile_grades")]
		public TilesGrades[] tile_grades { get; set; }

		public UserTileGrades(string userID, TilesGrades[] grades)
		{
			this.userID = userID;
			this.tile_grades = grades;
		}

	}

	public enum TileType
	{
		assignments,
		discussions,
		learning_outcomes
	}

	public class Tile
	{
		[JsonProperty(PropertyName = "id")]
		public int ID { get; private set; }

		[JsonProperty(PropertyName = "group_id")]
		public int GroupID { get; set; }

		[JsonProperty(PropertyName = "title")]
		public string Title { get; set; }

		[JsonProperty(PropertyName = "position")]
		public int Order { get; set; }

		[JsonProperty(PropertyName = "type")]
		public TileType Type { get; set; }

		[JsonProperty(PropertyName = "weight")]
		public double Weight { get; set; }

		[JsonProperty(PropertyName = "gradingType")]
		public AppGradingType GradingType { get; set; }

		[JsonProperty(PropertyName = "alt")]
		public bool Alt { get; set; }

		[JsonProperty(PropertyName = "visible")]
		public bool Visible { get; set; }

		[JsonProperty(PropertyName = "notifications")]
		public bool Notifications { get; set; }

		[JsonProperty(PropertyName = "entries")]
		public List<TileEntry> Entries { get; set; }

		public Tile(
			int id,
			int groupID,
			string title,
			int order,
			TileType type,
			double weight,
			AppGradingType gradingType,
			bool alt,
			bool visible,
			bool notifications
		)
		{
			this.ID = id;
			this.GroupID = groupID;
			this.Title = title;
			this.Order = order;
			this.Type = type;
			this.Weight = weight;
			this.GradingType = gradingType;
			this.Alt = alt;
			this.Visible = visible;
			this.Notifications = notifications;
			this.Entries = new();
		}
	}

	public class TileEntry
	{
		[JsonProperty(PropertyName = "tile_id")]
		public int TileID { get; set; }

		[JsonProperty(PropertyName = "title")]
		public string Title { get; set; }

		[JsonProperty(PropertyName = "content_id")]
		public int ContentID { get; set; }

		[JsonProperty(PropertyName = "weight")]
		public double Weight { get; set; }

		public TileEntry(int tileID, int ContentID, string title, double weight)
		{
			this.TileID = tileID;
			this.ContentID = ContentID;
			this.Title = title;
			this.Weight = weight;
		}
	}

	public class TileGrades
	{
		[JsonProperty(PropertyName = "tile_id")]
		public int TileID { get; set; }

		[JsonProperty(PropertyName = "grades")]
		public AppGrades Grades { get; set; }


		public TileGrades(int tileID, AppGrades grades)
		{
			this.TileID = tileID;
			this.Grades = grades;
		}
	}
}
