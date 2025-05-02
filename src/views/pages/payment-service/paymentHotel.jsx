import ListPayment from "components/list-display/payment-list";
import CardPaymentHotel from "components/payment-card/card-hotel";
const PaymentHotel = ({ listService, repoId }) => {
  return (
    <ListPayment
      listServices={listService}
      CardComponent={CardPaymentHotel}
      link="hotel"
      repoId={repoId}
    />
  );
};

export default PaymentHotel;
