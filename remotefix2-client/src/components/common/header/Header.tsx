import {
  Button,
  ButtonGroup,
  Container,
  Dropdown,
  DropdownButton,
  Navbar,
} from "react-bootstrap";
import { HeaderProps } from "../../../utils/types/menuItem.types";
import "./header.scss";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { getAllMenuItemsByScope } from "../../../redux/services/menuItem.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faEarthAfrica } from "@fortawesome/free-solid-svg-icons";
import Drawer from "./Drawer";
import { useTranslation } from "react-i18next";

const Header = ({ bigTitle }: HeaderProps) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const dispatch = useDispatch();

  const fetchMenuItems = async () => {
    await dispatch(
      getAllMenuItemsByScope({ sortOrder: "asc", scope: ["navigation"] }) as any
    );
  };

  const handleClose = () => setShowDrawer(false);
  const handleShow = () => {
    fetchMenuItems();
    setShowDrawer(true);
  };

  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const handleLanguageSelect = (lang: any) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);

    if (lang === "ar") {
      document.documentElement.setAttribute("dir", "rtl");
    } else {
      document.documentElement.setAttribute("dir", "ltr");
    }
    window.location.reload();
  };

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
          <ButtonGroup
            aria-label="Basic example"
            className="align-items-center btns"
          >
            <DropdownButton
              variant="dark"
              size="lg"
              title={<FontAwesomeIcon icon={faEarthAfrica} />}
              
            >
              <Dropdown.Item
                as="button"
                onClick={() => handleLanguageSelect("en")}
                className="d-flex justify-content-start"
              >
                <span className="fi fi-gb mx-2"></span> {t("English")}
              </Dropdown.Item>
              <Dropdown.Item
                as="button"
                onClick={() => handleLanguageSelect("ar")}
                className="d-flex justify-content-start"
              >
                <span className="fi fi-tn mx-2"></span> {t("Arabic")}
              </Dropdown.Item>
            </DropdownButton>
            <Button variant="dark" size="lg" onClick={handleShow}>
              <FontAwesomeIcon icon={faBars} />
            </Button>
          </ButtonGroup>
        </Container>
      </Navbar>
      <Drawer
        show={showDrawer}
        onHide={handleClose}
        placement={language === "ar" ? "start" : "end"}
      />
    </>
  );
};

export default Header;
