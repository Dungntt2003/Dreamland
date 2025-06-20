import ListPayment from "components/list-display/payment-list";
import CardPaymentHotel from "components/payment-card/card-hotel";
import { Empty } from "antd";
const PaymentHotel = ({ listService, repoId, servicePayment, date }) => {
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
            CardComponent={CardPaymentHotel}
            link="hotel"
            repoId={repoId}
            date={date}
            servicePayment={servicePayment}
          />
        </>
      )}
    </div>
  );
};

export default PaymentHotel;
