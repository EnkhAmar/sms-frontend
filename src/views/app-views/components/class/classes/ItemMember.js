
const ItemMember = ({students}) => (
	<p>{students} student{students > 1 ? 's' : ''}</p>
)

export default ItemMember;
