namespace API.Persistence
{
    public class Match
    {
        public Guid Id { get; set; }
        public MatchResult Player1Result { get; set; }
        public MatchResult Player2Result { get; set; }
        public MatchResult Player3Result { get; set; }
        public MatchResult Player4Result { get; set; }
    }
}