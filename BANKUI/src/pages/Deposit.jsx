import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import MoneyForm from '../components/MoneyForm';
import { useLoader } from '../context/LoaderContext';
import { deposit } from '../services/api';
import { errorMessage } from '../lib/http';

export default function Deposit() {
  const navigate = useNavigate();
  const loader = useLoader();

  const handleSubmit = async ({ amount, pin }, reset) => {
    loader.show('Depositing...');
    try {
      const { data } = await deposit(amount, pin);
      loader.hide();
      toast.success(data.msg || 'Deposit successful');
      reset();
      navigate('/dashboard');
      console.log('Deposit successful!', data);
    } catch (error) {
      loader.hide();
      toast.error(errorMessage(error, 'Deposit failed'));
      console.error('Deposit failed:', error);
    }
  };

  return (
    <MoneyForm
      title="Make a deposit"
      subtitle="Add money to your own account."
      icon="fa-money-bill-wave"
      buttonLabel="Deposit"
      onSubmit={handleSubmit}
    />
  );
}
