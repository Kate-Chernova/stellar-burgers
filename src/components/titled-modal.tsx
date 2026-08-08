import { useParams } from 'react-router-dom';
import { Modal } from './modal';
import { OrderInfo } from './order-info';

export const TitledModal = ({ onClose }: { onClose: () => void }) => {
  const { number } = useParams<{ number: string }>();
  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
