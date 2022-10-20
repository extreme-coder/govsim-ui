
import { useGetMessagesQuery } from '../../services/govsim';


export default function MessageHandler(props) {
  const { data: messages } = useGetMessagesQuery(props.country.id)
  return (
    (messages && messages.data.map((message) =>
      {
        return (<div key={message.id}>
          
        </div>)
      } 
    ))        
  );
};

