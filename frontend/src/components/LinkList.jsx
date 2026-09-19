import LinkItem from './LinkItem.jsx';

export default function LinkList({ links, onLinkClick }) {
  if (links.length === 0) {
    return <p className="empty">Nenhum link encurtado ainda. Os links criados nesta sessão aparecem aqui.</p>;
  }

  return (
    <ul className="link-list">
      {links.map((link) => (
        <LinkItem key={link.code} link={link} onClick={onLinkClick} />
      ))}
    </ul>
  );
}
