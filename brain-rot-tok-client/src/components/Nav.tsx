import { Link } from 'react-router-dom';

function Nav() {
	return (
		<>
			<div className="nav-container">
				<nav>
					<ul>
						<li><Link to="/">
							Basic Video Type
						</Link></li>
						<li><Link to="/subway-surfers-type">
							Subway Surfers Type
						</Link></li>
						<li><Link to="/minecraft-reddit-type">
							Minecraft-Reddit Type
						</Link></li>
					</ul>
				</nav>
			</div>
		</>
	)
}

export default Nav;