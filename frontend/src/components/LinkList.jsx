import LinkItem from './LinkItem.jsx';

export default function LinkList({ links }) {
  if (links.length === 0) {
    return <p className="empty">Você ainda não encurtou nenhum link.</p>;
  }

  return (
    <ul className="link-list">
      {links.map((link) => (
        <LinkItem key={link.code} link={link} />
      ))}
    </ul>
  );
}
