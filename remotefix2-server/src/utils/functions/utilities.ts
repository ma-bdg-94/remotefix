export const filterObject = (obj: any, props: string[]) => {
    const newObj = { ...obj };
    props.forEach((prop: string) => delete newObj[prop]);
  
    return newObj;
  };