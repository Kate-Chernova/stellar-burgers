import React, { FC } from 'react';
import {
  Button,
  ConstructorElement,
  CurrencyIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './burger-constructor.module.css';
import { BurgerConstructorUIProps } from './type';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorElement, Modal } from '@components';
import { Preloader, OrderDetailsUI } from '@ui';

export const BurgerConstructorUI: FC<BurgerConstructorUIProps> = ({
  constructorItems,
  orderRequest,
  price,
  orderModalData,
  onOrderClick,
  closeOrderModal
}) => (
  <section className={styles.burger_constructor} data-cy='constructor'>
    {constructorItems.bun ? (
      <div className={`${styles.element} mb-4 mr-4`} data-cy='orderBunTop'>
        <ConstructorElement
          type='top'
          isLocked
          text={`${constructorItems.bun.name} (верх)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-cy='orderBunTop'
      >
        Выберите булки
      </div>
    )}
    {constructorItems.ingredients.length > 0 ? (
      <ul className={styles.elements} data-cy='orderMain'>
        {constructorItems.ingredients.map(
          (ingredient: TConstructorIngredient, index: number) => (
            <BurgerConstructorElement
              ingredient={ingredient}
              index={index}
              totalItems={constructorItems.ingredients.length}
              key={ingredient.id}
            />
          )
        )}
      </ul>
    ) : (
      <div
        className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-cy='orderMain'
      >
        Выберите начинку
      </div>
    )}
    {constructorItems.bun ? (
      <div className={`${styles.element} mt-4 mr-4`} data-cy='orderBunBottom'>
        <ConstructorElement
          type='bottom'
          isLocked
          text={`${constructorItems.bun.name} (низ)`}
          price={constructorItems.bun.price}
          thumbnail={constructorItems.bun.image}
        />
      </div>
    ) : (
      <div
        className={`${styles.noBuns} ml-8 mb-4 mr-5 text text_type_main-default`}
        data-cy='orderBunBottom'
      >
        Выберите булки
      </div>
    )}
    <div className={`${styles.total} mt-10 mr-4`}>
      <div className={`${styles.price} mr-10`}>
        <p className='text text_type_digits-medium mr-2'>{price}</p>
        <CurrencyIcon type='primary' />
      </div>
      <Button
        type='primary'
        size='large'
        htmlType='button'
        onClick={onOrderClick}
      >
        Оформить заказ
      </Button>
    </div>

    {orderRequest && (
      <Modal onClose={closeOrderModal} title='Оформляем заказ...'>
        <Preloader />
      </Modal>
    )}

    {orderModalData && (
      <Modal onClose={closeOrderModal} title={orderModalData.name}>
        <OrderDetailsUI orderNumber={orderModalData.number} />
      </Modal>
    )}
  </section>
);
