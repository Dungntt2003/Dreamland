const ListPayment = ({ listServices, CardComponent, link }) => {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {listServices.map((item) => (
          <CardComponent item={item} key={item.id} link={link} />
        ))}
      </div>
    </div>
  );
};

export default ListPayment;
