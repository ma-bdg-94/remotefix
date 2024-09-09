import { Button, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { HeaderProps } from "./header.types";
import { Link } from "react-router-dom";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getAllMenuItemsByScope, getPrivateMenuItemsByScope } from "../../../redux/services/menuItem.service";
import { MenuItem } from "../../../utils/types/menuItem.types";

const Header = ({ bigTitle }: HeaderProps) => {
  const dispatch = useDispatch();
  const menuItems = useSelector((state: any) => state.menuItems?.menuItemList?.data?.menuItemList)

  const fetchMenuItems = async () => {
    await dispatch(getAllMenuItemsByScope({ sortOrder: 'asc', scope: ["navigation"] }) as any)
  }

  useEffect(() => {
    fetchMenuItems()
  }, [])

  return (
    <Navbar collapseOnSelect expand="lg" className="header">
      <Container>
        <Navbar.Brand href="/" className="brand">
          {bigTitle}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="m-auto menu">
            {menuItems?.map((item: MenuItem) => (
              <Link key={item?._id} to={item.link} className="navlink">
                <Nav.Link href={item.link}>{item.label?.en}</Nav.Link>
              </Link>
            ))}
          </Nav>
          <Nav className="controls">
            <Button variant="primary" as="a">
              Create Account
            </Button>
            <Button variant="warning" as="a">
              Sign In
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
