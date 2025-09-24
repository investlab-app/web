import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_legal/terms-of-service')({
  component: () => (
    <div className="prose prose-gray dark:prose-invert max-w-none">
      <h1>Terms of Service</h1>
      <p>Last updated: September 24, 2025</p>
      <h2>User Eligibility and Account Requirements</h2>
      <p>
        In order to use our website and/or receive our services, you must be at
        least 18 years of age, or of the legal age of majority in your
        jurisdiction, and possess the legal authority, right and freedom to
        enter into these Terms as a binding agreement. You are not allowed to
        use this website and/or receive services if doing so is prohibited in
        your country or under any law or regulation applicable to you.
      </p>
      <p>
        When creating an account with us, you must provide accurate, complete,
        and current information at all times. Failure to do so constitutes a
        breach of these Terms, which may result in immediate termination of your
        account.
      </p>
      <h2>Acceptance of Terms</h2>
      <p>
        By accessing the platform at http://www.investlab.app, you are agreeing
        to be bound by these terms of service, all applicable laws and
        regulations, and agree that you are responsible for compliance with any
        applicable local laws.
      </p>
      <h2>Use License</h2>
      <p>
        Permission is granted to temporarily access the materials (information
        or software) on InvestLab's platform for personal, non-commercial
        transitory viewing only.
      </p>
      <h2>Disclaimer</h2>
      <p>
        The materials on InvestLab's platform are provided on an 'as is' basis.
        InvestLab makes no warranties, expressed or implied, and hereby
        disclaims and negates all other warranties including, without
        limitation, implied warranties or conditions of merchantability, fitness
        for a particular purpose, or non-infringement of intellectual property
        or other violation of rights.
      </p>
      <h2>Educational Disclaimer</h2>
      <p>
        <strong>IMPORTANT NOTICE:</strong> This platform is for educational and
        informational purposes only and simulates paper trading without
        involving real money. It does not constitute financial advice. All
        trading activities are simulated, and no actual investments or losses
        occur. Always consult with a qualified financial advisor before making
        real investment decisions.
        <br />
        <br />
        The information on InvestLab is provided on an 'as is' basis. To the
        fullest extent permitted by law, InvestLab excludes all representations,
        warranties, conditions and terms whether express or implied, statutory
        or otherwise.
      </p>
      <h2>Limitations</h2>
      <p>
        In no event shall InvestLab or its suppliers be liable for any damages
        (including, without limitation, damages for loss of data or profit, or
        due to business interruption) arising out of the use or inability to use
        the platform.
      </p>
      <h2>Accuracy of Materials</h2>
      <p>
        The materials appearing on InvestLab could include technical,
        typographical, or photographic errors. InvestLab does not warrant that
        any of the materials on its platform are accurate, complete, or current.
      </p>
      <h2>Contact Information</h2>
      <p>
        For any questions about these Terms of Service, please contact us at:
        app-investlab@gmail.com
      </p>
      <h2>Governing Law</h2>
      <p>
        These terms and conditions are governed by and construed in accordance
        with the laws of Poland and you irrevocably submit to the exclusive
        jurisdiction of the courts in that location.
      </p>
      <h2>Dispute Resolution</h2>
      <p>
        Any dispute related to these Terms shall be resolved through binding
        arbitration in accordance with the laws of Poland. The arbitration shall
        take place in Poland, and the arbitration proceedings shall be conducted
        in English.
      </p>
    </div>
  ),
});
