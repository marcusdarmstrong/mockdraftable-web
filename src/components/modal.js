// @flow

import React from 'react';
import type { Element } from 'react';

type Props = {
  title: string,
  children?: Element<any>,
  closeModal: () => void
};

const Modal = ({ title, children, closeModal }: Props) => <div className="modal d-block">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h5 className="modal-title" id="exampleModalLongTitle">{title}</h5>
        <button type="button" className="close" onClick={() => closeModal()} aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </div>
  </div>
</div>;

Modal.defaultProps = {
  children: '',
};

export default Modal;
