import React, { useCallback, useState } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useRestaurantOverview } from 'app/hooks/useRestaurantOverview';
import { useFocusEffect } from '@react-navigation/native';
import { useIsDesktop } from 'app/hooks/useIsDesktop';
import { RestaurantOverviewMetrics } from 'app/components/home/RestaurantOverviewMetrics';

import EmptyState from 'app/components/common/EmptyState';
import FoodLoadingSpinner from 'app/components/FoodLoadingSpinner';
import InventoryStatusSummaryCard from 'app/components/home/InventoryStatusSummaryCard';
import TopSellingProductsCard from 'app/components/home/TopSellingProductsCard';
import RecentTransactionsSummary from 'app/components/home/RecentTransactionsSummary';
import ExpenseSummary from 'app/components/home/ExpensesSummary';
import PaymentMethodDistribution from 'app/components/home/PaymentMethodDistribution';
import DailySalesTransactionCard from 'app/components/home/DailySalesTransaction';
import { useHasPermission } from 'app/security/useHasPermission';
import { Permission } from 'app/security/permission';
import { useTheme } from 'app/hooks/useTheme';
import SkeletonResponsiveGrid from 'app/components/SkeletonResponsiveGrid';
import HomeOverviewSkeleton from 'app/components/HomeOverviewSkeleton';

const HomeScreen: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const {
    restaurantOverView,
    restaurantOverViewState,
    fetchRestaurantOverView,
    handleViewAllPress,
    handleAddPress,
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

  const { isLargeScreen, isTablet } = useIsDesktop();

  const canViewMetrics = useHasPermission(Permission.VIEW_HOME_SCREEN_METRICS);

  useFocusEffect(
    useCallback(() => {
      fetchRestaurantOverView();
    }, []),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRestaurantOverView();
    setRefreshing(false);
  }, [fetchRestaurantOverView]);

  if (restaurantOverViewState?.status === 'pending') {
    return (
      <View className="p-6">
        {isLargeScreen ? <HomeOverviewSkeleton /> : <SkeletonResponsiveGrid />}
      </View>
    );
  }

  if (!restaurantOverView) {
    return (
      <EmptyState
        iconName="bag-personal"
        message="No Data Available"
        subMessage="Please Refresh the Screen."
        iconSize={80}
        addButtonLabel="Add Food Items"
        onAddPress={() => handleAddPress('Menu')}
      />
    );
  }

  return (
    <View className="flex-1 p-4" style={{ backgroundColor: theme.primaryBg }}>
      {canViewMetrics && (
        <RestaurantOverviewMetrics
          totalSales={totalSales}
          totalOrders={totalNoOrders}
          totalExpenses={totalExpenses}
          activeTables={activeTables}
          isLargeScreen={isLargeScreen}
        />
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Payment Methods + Daily Sales */}
        <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
          <View
            style={{
              width: isTablet ? '48%' : '100%',
              backgroundColor: theme.secondaryBg,
            }}
            className="rounded-lg shadow-sm flex-1"
          >
            <PaymentMethodDistribution paymentMethods={paymentMethodDistribution} />
          </View>

          <View
            style={{
              width: isTablet ? '48%' : '100%',
              backgroundColor: theme.secondaryBg,
            }}
            className="rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
          >
            <DailySalesTransactionCard
              salesTransaction={dailySalesTransaction}
              onViewAllPress={() => handleViewAllPress('DailySales')}
            />
          </View>
        </View>

        {/* Expenses + Top Selling */}
        <View className={`mb-4 ${isTablet ? 'flex-row justify-between gap-2' : 'flex-col'}`}>
          <View
            style={{
              width: isTablet ? '48%' : '100%',
              backgroundColor: theme.secondaryBg,
            }}
            className="rounded-lg shadow-sm flex-1"
          >
            <ExpenseSummary
              expenses={expense}
              onViewAllPress={() => handleViewAllPress('Expenses')}
              onAddExpensesPress={() => handleAddPress('Expenses')}
            />
          </View>

          <View
            style={{
              width: isTablet ? '48%' : '100%',
              backgroundColor: theme.secondaryBg,
            }}
            className="rounded-lg shadow-sm flex-1 mt-4 md:mt-0"
          >
            <TopSellingProductsCard
              topSellingProducts={topSellingProducts}
              onViewAllPress={() => handleViewAllPress('DailySales')}
            />
          </View>
        </View>

        {/* Inventory Card */}
        <View className="mb-4 rounded-lg shadow-sm" style={{ backgroundColor: theme.secondaryBg }}>
          <InventoryStatusSummaryCard inventoryStatus={inventoryStatus} />
        </View>

        {/* Recent Transactions */}
        <View className="mb-4 rounded-lg shadow-sm" style={{ backgroundColor: theme.secondaryBg }}>
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
