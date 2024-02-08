import { Link, useLocation } from 'react-router-dom';

const navLinks = [
	{ path: '/', text: 'Basic Video Type' },
	{ path: '/subway-surfers-type', text: 'Subway Surfers Type' },
	{ path: '/minecraft-reddit-type', text: 'Minecraft-Reddit Type' },
	{ path: '/rumble-video-type', text: 'Rumble Video Type' },
	{ path: '/video-cutter', text: 'Video Cutter' },
];

function Nav() {
	const location = useLocation();

	return (
		<div className="nav-container">
			<nav>
				<ul>
					{navLinks.map((link) => (
						<li key={link.path}>
							<Link to={link.path} className={location.pathname === link.path ? 'nav-link active' : 'nav-link'}>
								{link.text}
							</Link>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}

export default Nav;
