import {
  Modal,
  Tabs
} from 'antd';
import PaymentForm from './paymentForm';
import PaymentHistory from './paymentHistory';

const { TabPane } = Tabs;

const PaymentModal = ({
  visible,
  handleCancel,
  handleSubmit,
  fields,
  paymentTypes,
  loading,
  payments,
  paymentTotal,
  loadingPayment,
  changeEdit,
  editPayment,
  deletePayment,
  paymentPage,
  getPayments
}) => {
  return (
    <>
      <Modal
        visible={visible}
        title="Payment"
        onCancel={handleCancel}
        footer={null}
        bodyStyle={{padding: "0px 25px"}}
      >
        <Tabs defaultActiveKey="1" tabBarStyle={{borderBottom: 'none'}}>
          <TabPane tab="Make Payment" key="1" style={{ borderBottom: 'none' }}>
            <PaymentForm
              fields={fields}
              paymentTypes={paymentTypes}
              loading={loading}
              handleSubmit={handleSubmit}
              handleCancel={handleCancel}
            />
          </TabPane>
          <TabPane tab="Payment History" key="2">
            <PaymentHistory
              payments={payments}
              paymentTypes={paymentTypes}
              loading={loadingPayment}
              changeEdit={changeEdit}
              editPayment={editPayment}
              deletePayment={deletePayment}
              currentPage={paymentPage}
              paymentTotal={paymentTotal}
              getPayments={getPayments}
              fields={fields}
            />
          </TabPane>
        </Tabs>

      </Modal>
    </>
  )
}

export default PaymentModal;
