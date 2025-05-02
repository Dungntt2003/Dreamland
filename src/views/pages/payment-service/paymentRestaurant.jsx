import ListPayment from "components/list-display/payment-list";
import CardPaymentRestaurant from "components/payment-card/card-res";
const PaymentRestaurant = ({ listService, repoId }) => {
  return (
    <div>
      <ListPayment
        listServices={listService}
        CardComponent={CardPaymentRestaurant}
        link="restaurant"
        repoId={repoId}
      />
    </div>
  );
};

export default PaymentRestaurant;
