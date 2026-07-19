import PageTransition from '../components/PageTransition';
import AccountDetailCard from '../components/AccountDetailCard';

export default function AccountDetails() {
  return (
    <PageTransition>
      <div className="max-w-xl mx-auto mt-6">
        <AccountDetailCard />
      </div>
    </PageTransition>
  );
}
