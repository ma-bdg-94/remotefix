import {
  Accordion,
  Button,
  ButtonGroup,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Offcanvas,
} from "react-bootstrap";
import { HeaderProps } from "./header.types";
import { Link } from "react-router-dom";
import "./header.scss";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllMenuItemsByScope,
  getPrivateMenuItemsByScope,
} from "../../../redux/services/menuItem.service";
import { MenuItem } from "../../../utils/types/menuItem.types";
import useMediaQuery from "../../../utils/hooks/useMediaQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEarthAfrica } from "@fortawesome/free-solid-svg-icons";
import Drawer from "./Drawer";

const Header = ({ bigTitle }: HeaderProps) => {
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const [showDrawer, setShowDrawer] = useState(false);

  const dispatch = useDispatch();
  const menuItems = useSelector(
    (state: any) => state.menuItems?.menuItemList?.data?.menuItemList
  );

  const fetchMenuItems = async () => {
    await dispatch(
      getAllMenuItemsByScope({ sortOrder: "asc", scope: ["navigation"] }) as any
    );
  };

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => {
    fetchMenuItems();
    setShowDrawer(true);
  }

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="lg"
        className="header"
        bg="dark"
        data-bs-theme="dark"
      >
        <Container>
          <Navbar.Brand href="/" className="brand">
            {bigTitle}
          </Navbar.Brand>
          <ButtonGroup aria-label="Basic example">
            <Button variant="dark" size="lg">
              <FontAwesomeIcon icon={faEarthAfrica} />
            </Button>
            <Button variant="dark" size="lg" onClick={handleShow}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </ButtonGroup>
        </Container>
      </Navbar>
      <Drawer show={showDrawer} onHide={handleClose} placement="end" />
    </>
  );
};

export default Header;
