import ListPayment from "components/list-display/payment-list";
import CardPaymentRestaurant from "components/payment-card/card-res";
const PaymentRestaurant = ({ listService, repoId, servicePayment }) => {
  return (
    <div>
      <ListPayment
        listServices={listService}
        CardComponent={CardPaymentRestaurant}
        link="restaurant"
        repoId={repoId}
        servicePayment={servicePayment}
      />
    </div>
  );
};

export default PaymentRestaurant;
