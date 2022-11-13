import { useGetEntitiesByFieldQuery } from '../../services/govsim';
import { useSelector } from 'react-redux';





export default function Promotions(props) {


  const { partyId } = props

  const { data } = useGetEntitiesByFieldQuery({ name: 'promotion', field: 'party', value: partyId, relation: 'id', populate: true })


  return (
    <table className="mb-0 table table-sm ">
      <thead>
        <tr><th>Bill</th><th>type</th><th>budget</th><th></th></tr>
      </thead>
      <tbody>
        {data && data.data.map((promotion) =>
          <tr key={promotion.id}>
            <td>{promotion.attributes.promise.data.attributes.name}</td>
            <td>{promotion.attributes.type}</td>
            <td>{promotion.attributes.budget}</td>            
          </tr>
        )}
      </tbody>
    </table>
  )
}

