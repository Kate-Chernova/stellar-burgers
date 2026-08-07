import styles from './modal-overlay.module.css';

export const ModalOverlayUI = ({
  onClick,
  ...props
}: {
  onClick: () => void;
  [key: string]: any;
}) => <div className={styles.overlay} onClick={onClick} {...props} />;
