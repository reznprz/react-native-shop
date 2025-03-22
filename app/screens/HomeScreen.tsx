import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useRestaurantOverview } from 'app/hooks/useRestaurantOverview';
import ExpenseSummary from 'app/components/home/ExpensesSummary';
import PaymentMethodDistribution from 'app/components/home/PaymentMethodDistribution';
import DailySalesTransactionCard from 'app/components/home/DailySalesTransaction';
import { RestaurantOverviewMetrics } from 'app/components/home/RestaurantOverviewMetrics';
import EmptyState from 'app/components/common/EmptyState';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import InventoryStatusSummaryCard from 'app/components/home/InventoryStatusSummaryCard';
import TopSellingProductsCard from 'app/components/home/TopSellingProductsCard';
import RecentTransactionsSummary from 'app/components/home/RecentTransactionsSummary';

const HomeScreen: React.FC = () => {
  const {
    restaurantOverView,
    restaurantOverViewState,
    fetchRestaurantOverView,
    handleViewAllPress,
  } = useRestaurantOverview();

  const {
    totalSales,
    totalNoOrders,
    totalExpenses,
    activeTables,
    expense,
    paymentMethodDistribution,
    dailySalesTransaction,
    inventoryStatus,
    topSellingProducts,
    recentTransactions,
  } = restaurantOverView;

  const { isLargeScreen, width } = useIsDesktop();
  const isTablet = width >= 768;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchRestaurantOverView();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurantOverView();
    setRefreshing(false);
  }, [fetchRestaurantOverView]);

  if (restaurantOverViewState?.status === 'pending') {
    return <FoodLoadingSpinner iconName="hamburger" />;
  }

  if (!restaurantOverView) {
    return (
      <EmptyState
        iconName="bag-personal"
        message="No Data Available"
        subMessage="Please Refresh the Screen."
        iconSize={80}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <RestaurantOverviewMetrics
        totalSales={totalSales}
        totalOrders={totalNoOrders}
        totalExpenses={totalExpenses}
        activeTables={activeTables}
        isLargeScreen={isLargeScreen}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Payment Methods and Expenses - Equal Height Pair */}
        <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
          <View
            style={{ width: isTablet ? '48%' : '100%' }}
            className="bg-white rounded-lg shadow-sm flex-1"
          >
            <PaymentMethodDistribution paymentMethods={paymentMethodDistribution} />
          </View>
          <View
            style={{ width: isTablet ? '48%' : '100%' }}
            className="bg-white rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
          >
            <DailySalesTransactionCard
              salesTransaction={dailySalesTransaction}
              onViewAllPress={() => handleViewAllPress('DailySales')}
            />
          </View>
        </View>

        {/* Daily Sales and Top Selling Products - Equal Height Pair */}
        <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
          <View
            style={{ width: isTablet ? '48%' : '100%' }}
            className="bg-white rounded-lg shadow-sm flex-1"
          >
            <ExpenseSummary
              expenses={expense}
              onViewAllPress={() => handleViewAllPress('Expenses')}
            />
          </View>
          <View
            style={{ width: isTablet ? '48%' : '100%' }}
            className="bg-white rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
          >
            <TopSellingProductsCard
              topSellingProducts={topSellingProducts}
              onViewAllPress={() => handleViewAllPress('Products')}
            />
          </View>
        </View>

        {/* Inventory Status - Full Width */}
        <View className="mb-4 bg-white rounded-lg shadow-sm">
          <InventoryStatusSummaryCard inventoryStatus={inventoryStatus} />
        </View>

        {/* Recent Transactions - Full Width */}
        <View className="mb-4 bg-white rounded-lg shadow-sm">
          <RecentTransactionsSummary
            recentTransactions={recentTransactions}
            isLargeScreen={isLargeScreen}
            onViewAllPress={() => handleViewAllPress('RecentTrans')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;
