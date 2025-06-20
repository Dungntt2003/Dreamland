const ListPayment = ({
  listServices,
  CardComponent,
  link,
  repoId,
  servicePayment,
  date = "",
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
          listServices
            .filter(
              (item, index, self) =>
                index === self.findIndex((s) => s.name === item.name)
            )
            .map((item) => (
              <CardComponent
                item={item}
                key={item.id}
                link={link}
                repoId={repoId}
                date={date}
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
