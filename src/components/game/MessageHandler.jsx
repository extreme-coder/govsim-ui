
import { useGetMessagesQuery } from '../../services/govsim';


export default function MessageHandler(props) {
  const { data: messages } = useGetMessagesQuery('group')
  return (
    (messages && messages.data.map((message) =>
      {
        return (<div key={message.id}>
          {message.attributes.body}
        </div>)
      } 
    ))        
  );
};

