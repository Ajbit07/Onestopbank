import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MoneyForm from '../components/MoneyForm';
import { useLoader } from '../context/LoaderContext';
import { withdraw } from '../services/api';
import { errorMessage } from '../lib/http';

export default function Withdraw() {
  const navigate = useNavigate();
  const loader = useLoader();

  const handleSubmit = async ({ amount, pin }, reset) => {
    loader.show('Withdrawing...');
    try {
      const { data } = await withdraw(amount, pin);
      loader.hide();
      toast.success(data.msg || 'Withdrawal successful');
      reset();
      navigate('/dashboard');
      console.log('Withdrawal successful!', data);
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Withdrawal failed'));
      console.error('Withdrawal failed:', error);
    }
  };

  return (
    <MoneyForm
      title="Withdraw funds"
      subtitle="Take money out of your account."
      icon="fa-money-bill"
      buttonLabel="Withdraw"
      onSubmit={handleSubmit}
    />
  );
}
