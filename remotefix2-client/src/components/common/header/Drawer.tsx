import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Nav, Offcanvas } from "react-bootstrap";
import { DrawerProps } from "../../../utils/types/menuItem.types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import './header.scss'

const Drawer = ({ show, onHide, placement }: DrawerProps) => {
  const { t, i18n } = useTranslation();
  const { language } = i18n;

  const menuItems = useSelector(
    (state: any) => state.menuItems?.menuItemList?.data?.menuItemList
  );

  return (
    <Offcanvas show={show} onHide={onHide} placement={placement} className="drawer">
      <Offcanvas.Header
        closeButton
        className="d-flex justify-content-between drawer_header"
      >
        <Offcanvas.Title
          className="d-flex align-items-center drawer_header_title"
        >
          <FontAwesomeIcon icon={faBars} />
          <div className="mx-2">{t("Menu")}</div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="drawer_body">
        <Accordion className="drawer_body_accordion">
          {menuItems?.map((item: any) => (
            <Accordion.Item
              key={item?._id}
              eventKey={item?._id}
              className="border-0 drawer_body_accordion_item"
            >
              <Accordion.Header className="justify-content-between drawer_body_accordion_item_header">
                {item?.label[language]}
              </Accordion.Header>
              <Accordion.Body className="drawer_body_accordion_item_body">
                <Nav defaultActiveKey="/home" className="flex-column">
                  {item?.subItems?.map((si: any) => (
                    <Nav.Link key={si?._id} href={si?.link}>
                      {si?.label[language]}
                    </Nav.Link>
                  ))}
                </Nav>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;
