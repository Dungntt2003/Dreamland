import ListPayment from "components/list-display/payment-list";
import CardPaymentEnter from "components/payment-card/card-enter";
import { Empty } from "antd";
const PaymentEntertainment = ({
  listService,
  repoId,
  servicePayment,
  date,
}) => {
  return (
    <div>
      {listService.length === 0 ? (
        <>
          <Empty />
        </>
      ) : (
        <>
          <ListPayment
            listServices={listService}
            CardComponent={CardPaymentEnter}
            link="entertainment"
            repoId={repoId}
            date={date}
            servicePayment={servicePayment}
          />
        </>
      )}
    </div>
  );
};

export default PaymentEntertainment;
