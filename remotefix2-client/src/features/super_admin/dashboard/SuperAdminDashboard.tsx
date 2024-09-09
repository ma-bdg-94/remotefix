import { Suspense, useEffect } from "react";
import { Button, Container, Form, FormGroup, Row } from "react-bootstrap";
import { Helmet } from "react-helmet-async";
import { Controller, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import {
  createMenuItem,
  getAllMenuItems,
  getAllMenuItemsByScope,
  getMenuItemById,
  softDeleteOrRetrieveMenuItem,
  updateMenuItem,
  updateMenuItemArchivedStatus,
  updateMenuItemPrivacy,
  updateMenuItemScope,
} from "../../../redux/services/menuItem.service";
import { MenuItemCreationData } from "../../../utils/types/menuItem.types";

const SuperAdminDashboard = () => {
  const dispatch = useDispatch();
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue
  } = useForm();

  const menuItems = useSelector(
    (state: any) => state.menuItems?.menuItemList?.data?.menuItemList
  );
  const menuItem = useSelector(
    (state: any) => state.menuItems?.menuItemData?.data?.menuItem
  );

  useEffect(() => {
    dispatch(getAllMenuItems({ sortOrder: "asc" }) as any);
  }, []);

  useEffect(() => {
    console.log("first", menuItems);
  }, []);

  const onSubmit = async (data: any) => {
    try {
      const formattedData: any = {
        link: data.link,
        label: { en: data.labelEn, ar: data.labelEn },
      };
      console.log("data", formattedData);
      await dispatch(
        updateMenuItem({
          id: "66d971c040486187b80687fb",
          menuItemUpdateData: formattedData,
        }) as any
      );
    } catch (error) {
      console.error(error);
    }
  };

  const getScopedData = async () => {
    try {
      const result = await dispatch(getMenuItemById({ id: "66d971c040486187b80687fb" }) as any);
      const menuItemData = result?.payload?.data?.menuItem
      if (menuItemData) {
        setValue("link", menuItemData.link || "");
        setValue("labelEn", menuItemData.label?.en || "");
        setValue("labelAr", menuItemData.label?.ar || "");
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Helmet>
        <title>Super Admin Dashboard</title>
      </Helmet>
      <div>SuperAdminDashboard</div>
      <Form onSubmit={handleSubmit((e) => onSubmit(e))}>
        <Container>
          <Row className="my-3">
            <Controller
              name="link"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <FormGroup>
                    <input
                      id="link"
                      type="text"
                      {...field}
                    />
                    <label className="label-responsive mx-3">email</label>
                    {errors.email && (
                      <small className="text-danger mx-1">field</small>
                    )}
                  </FormGroup>
                </>
              )}
            />
          </Row>
          <Row className="my-3">
            <Controller
              name="labelEn"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <FormGroup>
                    <input
                      id="labelEn"
                      type="text"
                      {...field}
                    />
                    <label className="label-responsive mx-3">password</label>
                    {errors.password && (
                      <small className="text-danger mx-1">field</small>
                    )}
                  </FormGroup>
                </>
              )}
            />
          </Row>
          <Row className="my-3">
            <Controller
              name="labelAr"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <>
                  <FormGroup>
                    <input
                      id="labelAr"
                      type="text"
                      {...field}
                    />
                    <label className="label-responsive mx-3">password</label>
                    {errors.password && (
                      <small className="text-danger mx-1">field</small>
                    )}
                  </FormGroup>
                </>
              )}
            />
          </Row>
          <Row className="px-5 my-3">
            <Button color="info" type="submit" className="fw-bold">
              Update
            </Button>
          </Row>
        </Container>
      </Form>

      <Button color="info" className="fw-bold" onClick={() => getScopedData()}>
        Fetch data
      </Button>
    </Suspense>
  );
};

export default SuperAdminDashboard;
