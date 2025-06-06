const ListPayment = ({
  listServices,
  CardComponent,
  link,
  repoId,
  servicePayment,
}) => {
  return (
    <div style={{ padding: "16px" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {listServices &&
          listServices.map((item) => (
            <CardComponent
              item={item}
              key={item.id}
              link={link}
              repoId={repoId}
              checkPayment={servicePayment.some(
                (payment) => payment.service_id === item.id
              )}
            />
          ))}
      </div>
    </div>
  );
};

export default ListPayment;
