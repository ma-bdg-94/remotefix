import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { HeaderProps, NavItem } from "./header.types";
import { Link } from "react-router-dom";
import './header.scss';

const Header = ({ bigTitle, navs }: HeaderProps) => (
  <Navbar collapseOnSelect expand="lg" className="header">
    <Container>
      <Navbar.Brand href="/" className="brand">{bigTitle}</Navbar.Brand>
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="m-auto menu">
          {navs?.map((item: NavItem) =>
           (
              <Link key={item.label.en} to={item.link} className="navlink">
                <Nav.Link href={item.link}>
                  {item.label.en}
                </Nav.Link>
              </Link>
            )
          )}
        </Nav>
        <Nav className="controls">
          <Button variant="primary" as="a">Create Account</Button>
          <Button variant="warning" as="a">Sign In</Button>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
);

export default Header;
