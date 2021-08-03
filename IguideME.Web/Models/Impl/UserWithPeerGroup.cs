using System;
using System.Collections.Generic;
using IguideME.Web.Services;
using Newtonsoft.Json;

namespace IguideME.Web.Models.Impl
{
    public class UserWithPeerGroup : User
    {
        [JsonIgnore]
        private Boolean LoadedPeers = false;

        [JsonIgnore]
        public int GoalGrade = 0;

        [JsonIgnore]
        private List<User> Peers = new List<User>();

        public UserWithPeerGroup(
            int id,
            int courseID,
            int userID,
            string loginID,
            string sisID,
            string name,
            string sortableName,
            string role,
            string hash = null,
            Boolean autoLoad = false) : base(id, courseID, userID, loginID, sisID, name, sortableName, role, hash)
        {
            this.ID = id;
            this.CourseID = courseID;
            this.UserID = userID;
            this.LoginID = loginID;
            this.SisID = sisID;
            this.Name = name;
            this.SortableName = sortableName;
            this.Role = role;

            if (autoLoad) this.LoadPeers();
        }

        public void LoadPeers()
        {
            var minPeerGroupSize =
                DatabaseManager.Instance.GetMinimumPeerGroupSize(this.CourseID);
            var courseStudents =
                DatabaseManager.Instance.GetUsers(this.CourseID, "student", this.Hash);

            // Peer group size cannot exceed minimum treshold, no comparison
            // possible.
            if (courseStudents.Count < minPeerGroupSize) return;

            if (!DatabaseManager.Instance.HasPersonalizedPeers(this.CourseID))
            {
                // If the course does not have personalized peers consider
                // every other enrolled student a peer.
                courseStudents
                    .FindAll(s => s.LoginID != this.LoginID)
                    .ForEach(s => this.Peers.Add(s));
                this.LoadedPeers = true;
                return;
            }

            // If personalized peers are enabled then assert the student
            // provided a goal grade.
            var _grade = DatabaseManager.Instance.GetUserGoalGrade(
                this.CourseID, this.LoginID);

            if (_grade == null) return;

            /**
             * When identifying peers we adhere to the simple principle that
             * a peer group must have a minimal size and the group is 
             * populated with students whom have the most similar goal 
             * grade. If there are too few students with the same grade goal
             * as the student, students with a higher peer grade will be sought
             * first, then students with a lower grade goal until the group size
             * exceeds the minimum.
             */
            List<int> _grades = new List<int>();
            var grade = (int)_grade;
            var offset = 1;
            this.GoalGrade = grade;

            List<User> peers = new List<User>();
            _grades.Add(grade);

            DatabaseManager.Instance
                .GetUsersWithGoalGrade(this.CourseID, (int)grade, this.Hash)
                .FindAll(u => u.LoginID != this.LoginID)
                .ForEach(x => peers.Add(x));

            while (peers.Count < minPeerGroupSize)
            {
                if (offset > 9) break;

                // Keep filling the peer group with more distant peers 
                var requiredPeers = minPeerGroupSize - peers.Count;

                // Check upwards peers
                DatabaseManager.Instance
                    .GetUsersWithGoalGrade(this.CourseID, (int)grade + offset, this.Hash)
                    .GetRange(0, requiredPeers)
                    .ForEach(x => peers.Add(x));
                // Check if more peers are required
                requiredPeers = minPeerGroupSize - peers.Count;
                if (requiredPeers == 0) break;

                // Check downward peers
                DatabaseManager.Instance
                    .GetUsersWithGoalGrade(this.CourseID, (int)grade - offset, this.Hash)
                    .GetRange(0, requiredPeers)
                    .ForEach(x => peers.Add(x));

                // Try to find peers more distant to the current student
                offset += 1;

            }

            this.Peers = peers;
            this.LoadedPeers = true;
        }

        public List<User> GetPeers()
        {
            // LoadPeers() must be called first.
            if (!this.LoadedPeers) return null;
            return this.Peers;
        }
    }
}
