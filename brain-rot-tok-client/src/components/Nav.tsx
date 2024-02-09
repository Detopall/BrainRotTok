import { Link, useLocation } from 'react-router-dom';
import basicIcon from '../assets/svg/basic.svg';
import videoCutterIcon from '../assets/svg/video_cutter.svg';
import subwaySurfersIcon from '../assets/svg/subway_surfers.svg';
import rumbleIcon from '../assets/svg/rumble.svg';
import minecraftIcon from '../assets/svg/minecraft.svg';

const navLinks = [
	{ path: '/', text: 'Basic Video Type', icon: basicIcon },
	{ path: '/subway-surfers-type', text: 'Subway Surfers Type', icon: subwaySurfersIcon },
	{ path: '/minecraft-reddit-type', text: 'Minecraft-Reddit Type', icon: minecraftIcon },
	{ path: '/rumble-video-type', text: 'Rumble Video Type', icon: rumbleIcon },
	{ path: '/video-cutter', text: 'Video Cutter', icon: videoCutterIcon },
];

function Nav() {
	const location = useLocation();

	return (
		<div className="nav-container">
			<nav>
				<ul>
					{navLinks.map((link) => (
						<li key={link.path}>
							<img src={link.icon} alt={link.text} className="nav-icon" />
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
