import React from 'react';
import { Link } from 'react-router';

const SelfEnrolledUser = () => {
  return (
    <div className="wrapper columns large-12">
      <div className="row expanded text-center">
        <div className="columns large-12 top-buffer">
          <h5>Welcome to Dock Health!</h5>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            Protecting patient data and compliance with HIPAA is essential to
            our work and yours. We noticed your email address is not associated
            with an organization that has been given access to Dock Health
            before.
          </h6>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            We would love to setup you and your team to be HIPAA complaint which
            requires signing a Business Associates Agreement (BAA) and being
            part of our paid program.
          </h6>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            In the meantime, we’d love for you to explore Dock Health and see
            how we can help you and your team work better together. We’ve got
            the secure solution you’ve been searching for to ease the
            administrative burden of patient care.
          </h6>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            Please enjoy a free demo account and see how secure collaboration
            and task management can reduce burnout, improve efficiency and
            provide more highly reliable care.
          </h6>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            For questions or to setup your HIPAA compliant organization, contact
            us at support@dock.health or find us at Dock.Health
          </h6>
        </div>
      </div>
      <div className="row expanded unenrolled-terms">
        <div className="columns large-12 top-buffer">
          <h6>
            I agree to the Terms of Service, End User License Agreement, and
            will use Dock Health for demonstration purposes only. I will not put
            Protected Health Information (PHI) on Dock Health until our
            organization has been setup in accordance with HIPAA and a BAA has
            been signed.
          </h6>
        </div>
      </div>
      <div className="row expanded">
        <div className="columns large-12 top-buffer text-right details">
          <h4 className="subtitle">
            <Link to="/tasks">
              <button type="button" className="button secondary expand">
                I agree
              </button>
            </Link>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default SelfEnrolledUser;
