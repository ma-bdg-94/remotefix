import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Nav, Offcanvas } from "react-bootstrap";
import { DrawerProps } from "./header.types";
import { useSelector } from "react-redux";

const Drawer = ({ show, onHide, placement }: DrawerProps) => {
  const menuItems = useSelector(
    (state: any) => state.menuItems?.menuItemList?.data?.menuItemList
  );

  return (
    <Offcanvas show={show} onHide={onHide} placement={placement}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ display: "flex", alignItems: "center" }}>
          <FontAwesomeIcon icon={faBars} />
          <div className="mx-2">Menu</div>
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Accordion>
          {menuItems?.map((item: any) => (
            <Accordion.Item key={item?._id} eventKey={item?._id} style={{ border: "none" }}>
              <Accordion.Header>{item?.label?.en}</Accordion.Header>
              <Accordion.Body>
                <Nav defaultActiveKey="/home" className="flex-column">
                  <Nav.Link href="/home">Active</Nav.Link>
                  <Nav.Link eventKey="link-1">Link</Nav.Link>
                  <Nav.Link eventKey="link-2">Link</Nav.Link>
                  <Nav.Link eventKey="disabled" disabled>
                    Disabled
                  </Nav.Link>
                </Nav>
              </Accordion.Body>
            </Accordion.Item>
          ))}

          {/* <Accordion.Item eventKey="1" style={{ border: "none" }}>
            <Accordion.Header>Accordion Item #2</Accordion.Header>
            <Accordion.Body>
              <Nav defaultActiveKey="/home" className="flex-column">
                <Nav.Link href="/home">Active</Nav.Link>
                <Nav.Link eventKey="link-1">Link</Nav.Link>
                <Nav.Link eventKey="link-2">Link</Nav.Link>
                <Nav.Link eventKey="disabled" disabled>
                  Disabled
                </Nav.Link>
              </Nav>
            </Accordion.Body>
          </Accordion.Item> */}
        </Accordion>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;
