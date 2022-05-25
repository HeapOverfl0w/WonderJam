namespace API.Persistence
{
    public class MatchResult
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public int Kills { get; set; }
        public int Deaths { get; set; }
    }
}