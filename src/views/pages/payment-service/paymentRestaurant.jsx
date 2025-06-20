import ListPayment from "components/list-display/payment-list";
import CardPaymentRestaurant from "components/payment-card/card-res";
import { Empty } from "antd";
const PaymentRestaurant = ({ listService, repoId, servicePayment, date }) => {
  return (
    <div>
      {listService.length === 0 ? (
        <Empty />
      ) : (
        <>
          <ListPayment
            listServices={listService}
            CardComponent={CardPaymentRestaurant}
            link="restaurant"
            repoId={repoId}
            date={date}
            servicePayment={servicePayment}
          />
        </>
      )}
    </div>
  );
};

export default PaymentRestaurant;
