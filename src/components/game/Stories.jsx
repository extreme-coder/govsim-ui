import { useGetEntitiesByFieldQuery } from '../../services/govsim';


export default function MessageHandler(props) {
  const { data: stories } = useGetEntitiesByFieldQuery({ name: 'story', field: 'country', relation:'id',  value: props.country.id, sort: 'desc' })
  return (
    (stories && stories.data.map((story) =>
      {
        return (
        <div key={story.id}>
          <h4>{story.attributes.headline}</h4>
            <p>{story.attributes.body}</p>
        </div>)
      } 
    ))        
  );
};

