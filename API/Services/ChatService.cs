namespace API.Services
{
    
    public class ChatService
    {
        private List<string> _chats;

        public ChatService() 
        {
            _chats = new List<string>();
        }

        public void AddMessage(string message)
        {
            _chats.Add(message);
            if (_chats.Count() > 30)
            {
                _chats.RemoveAt(0);
            }
        }

        public List<string> GetMessages(string lastMessage)
        {
            var chatIndex = 0;
            for(var t = _chats.Count() - 1; t > -1; t--) 
            {
                if (_chats[t] == lastMessage) {
                    chatIndex = t + 1;
                    break;
                }
            }

            if (chatIndex == 0) {
                return _chats;
            }

            if (_chats.Count() <= chatIndex)
                return new List<string>();
            else
                return _chats.GetRange(chatIndex, _chats.Count() - chatIndex);
        }
    }
}