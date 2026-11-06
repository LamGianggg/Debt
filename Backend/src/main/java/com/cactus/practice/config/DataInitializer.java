package com.cactus.practice.config;

import com.cactus.practice.entity.*;
import com.cactus.practice.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final SubscriptionRepository subscriptionRepository;
    private final TransactionRepository transactionRepository;
    private final PayoutRepository payoutRepository;
    private final ConnectedAccountRepository connectedAccountRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DataInitializer(UserRepository userRepository,
                           CustomerRepository customerRepository,
                           SubscriptionRepository subscriptionRepository,
                           TransactionRepository transactionRepository,
                           PayoutRepository payoutRepository,
                           ConnectedAccountRepository connectedAccountRepository,
                           ProductRepository productRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.customerRepository = customerRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.transactionRepository = transactionRepository;
        this.payoutRepository = payoutRepository;
        this.connectedAccountRepository = connectedAccountRepository;
        this.productRepository = productRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedCustomersAndSubscriptions();
        seedTransactions();
        seedPayouts();
        seedConnectedAccounts();
        seedProducts();
        logger.info(">>> Debt Management System (Hệ thống Quản lý Công nợ) Initialized Successfully! <<<");
    }

    private void seedUsers() {
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User("admin", passwordEncoder.encode("123456"), "admin@debtmaster.vn");
            admin.setRoles(Set.of(RoleType.ROLE_ADMIN, RoleType.ROLE_STAFF, RoleType.ROLE_USER));
            userRepository.save(admin);
            logger.info("Created default administrator: admin / 123456 (ROLE_ADMIN)");
        }

        if (!userRepository.existsByUsername("staff")) {
            User staff = new User("staff", passwordEncoder.encode("123456"), "ketoan@debtmaster.vn");
            staff.setRoles(Set.of(RoleType.ROLE_STAFF, RoleType.ROLE_USER));
            userRepository.save(staff);
            logger.info("Created default staff user: staff / 123456 (ROLE_STAFF)");
        }
    }

    private void seedCustomersAndSubscriptions() {
        if (customerRepository.count() > 0) return;

        Customer cust1 = new Customer(
                "cus_DEBT_001", "Công ty TNHH Hoàng Phát", "ketoan@hoangphat.vn", "+84 (024) 3892-1234",
                "$5,400.00 USD", "$1,340.00 USD", 2, "Aug 14, 2026", "Active",
                "Tầng 5, Tòa nhà Charmvit, 117 Trần Duy Hưng, Hà Nội", "Vietcombank •••• 4242"
        );
        customerRepository.save(cust1);

        Subscription sub1 = new Subscription(
                "sub_hd_01", cust1, "Hợp đồng trả góp thiết bị máy móc", "$990.00/tháng", "Active", "Oct 14, 2026"
        );
        subscriptionRepository.save(sub1);

        Customer cust2 = new Customer(
                "cus_DEBT_002", "Tập đoàn Xây dựng An Bình", "finance@anbinhgroup.com", "+84 (028) 3910-5678",
                "$12,800.00 USD", "$2,500.00 USD", 1, "Sep 01, 2026", "Active",
                "Số 88 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh", "Techcombank •••• 1092"
        );
        customerRepository.save(cust2);

        Subscription sub2 = new Subscription(
                "sub_hd_02", cust2, "Hạn mức nợ gối đầu vật liệu công trình", "$2,500.00/tháng", "Active", "Oct 01, 2026"
        );
        subscriptionRepository.save(sub2);

        Customer cust3 = new Customer(
                "cus_DEBT_003", "Công ty CP Công Nghệ Việt", "billing@vietitech.com", "+84 (024) 7300-8899",
                "$0.00 USD", "$4,900.00 USD", 1, "Jul 22, 2026", "Active",
                "Khu Công Nghệ Cao Hòa Lạc, Thạch Thất, Hà Nội", "MBBank •••• 3004"
        );
        customerRepository.save(cust3);

        Customer cust4 = new Customer(
                "cus_DEBT_004", "Thương Mại & Dịch Vụ Đại Nam", "tainv@dainam.com", "+84 (0236) 3822-456",
                "$24,500.00 USD", "$15,000.00 USD", 1, "Jun 15, 2026", "Active",
                "152 Nguyễn Văn Linh, Quận Hải Châu, TP. Đà Nẵng", "BIDV •••• 5511"
        );
        customerRepository.save(cust4);

        Customer cust5 = new Customer(
                "cus_DEBT_005", "Nguyễn Văn Hùng (Cá nhân)", "hung.nv@gmail.com", "+84 912 345 678",
                "$0.00 USD", "$0.00 USD", 0, "May 30, 2026", "Active",
                "Số 45 Ngõ 12 Đào Tấn, Ba Đình, Hà Nội", "VPBank •••• 9812"
        );
        customerRepository.save(cust5);

        Customer cust6 = new Customer(
                "cus_DEBT_006", "Doanh nghiệp Tư nhân Minh Phát", "minhphat.contact@gmail.com", "+84 (0274) 3811-999",
                "$18,500.00 USD", "$0.00 USD", 0, "Sep 09, 2026", "Delinquent",
                "KCN VSIP 1, Thuận An, Bình Dương", "ACB •••• 4012"
        );
        customerRepository.save(cust6);
    }

    private void seedTransactions() {
        if (transactionRepository.count() > 0) return;

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_091", "$990.00 USD", "$990.00 USD", "-$29.01 USD", "$960.99 USD",
                "Succeeded", "success", "Công ty TNHH Hoàng Phát", "ketoan@hoangphat.vn",
                "Chuyển khoản VCB •••• 4242", "Sep 14, 2026, 11:14:02 PM", new BigDecimal("990.00"),
                "Thanh toán đợt 1 Hợp đồng công nợ #HD-2026-091"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_088", "$2,500.00 USD", "$2,500.00 USD", "-$72.80 USD", "$2,427.20 USD",
                "Succeeded", "success", "Tập đoàn Xây dựng An Bình", "finance@anbinhgroup.com",
                "Ủy nhiệm chi TCB •••• 1092", "Sep 14, 2026, 8:30:15 AM", new BigDecimal("2500.00"),
                "Thu hồi công nợ vật tư quý 3/2026"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_077", "$4,900.00 USD", "$4,900.00 USD", "-$142.40 USD", "$4,757.60 USD",
                "Succeeded", "success", "Công ty CP Công Nghệ Việt", "billing@vietitech.com",
                "Visa Doanh nghiệp •••• 3004", "Sep 13, 2026, 3:15:40 PM", new BigDecimal("4900.00"),
                "Tất toán gói dịch vụ phần mềm trả chậm"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_065", "$350.00 USD", "$350.00 USD", "-$10.45 USD", "$339.55 USD",
                "Succeeded", "success", "Công ty TNHH Hoàng Phát", "ketoan@hoangphat.vn",
                "Chuyển khoản VCB •••• 4242", "Sep 13, 2026, 1:05:22 AM", new BigDecimal("350.00"),
                "Thanh toán phí phạt chậm nợ kỳ 2"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_050", "$15,000.00 USD", "$15,000.00 USD", "-$435.30 USD", "$14,564.70 USD",
                "Succeeded", "success", "Thương Mại & Dịch Vụ Đại Nam", "tainv@dainam.com",
                "Hóa đơn bảo lãnh BIDV •••• 5511", "Sep 12, 2026, 10:00:00 AM", new BigDecimal("15000.00"),
                "Quyết toán công nợ dự án tổng kho logistic"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_042", "$1,200.00 USD", "$1,200.00 USD", "$0.00 USD", "$0.00 USD",
                "Refunded", "neutral", "Nguyễn Văn Hùng (Cá nhân)", "hung.nv@gmail.com",
                "Thẻ tín dụng •••• 9812", "Sep 11, 2026, 4:22:18 PM", new BigDecimal("1200.00"),
                "Hoàn trả tiền đặt cọc nợ do hủy biên bản cam kết"
        ));

        transactionRepository.save(new Transaction(
                "tx_DEBT_2026_019", "$3,800.00 USD", "$3,800.00 USD", "$0.00 USD", "$0.00 USD",
                "Failed", "error", "Doanh nghiệp Tư nhân Minh Phát", "minhphat.contact@gmail.com",
                "Mastercard •••• 4012", "Sep 10, 2026, 11:45:00 AM", new BigDecimal("3800.00"),
                "Thanh toán thất bại: Tài khoản đối tác không đủ số dư"
        ));
    }

    private void seedPayouts() {
        if (payoutRepository.count() > 0) return;

        payoutRepository.save(new Payout(
                "po_REC_2026_01", "$18,250.00 USD", new BigDecimal("18250.00"),
                "Paid", "success", "Vietcombank •••• 8841 (Tài khoản thu hồi nợ)", "Sep 12, 2026", "Sep 14, 2026", "Đối soát thu nợ tự động"
        ));

        payoutRepository.save(new Payout(
                "po_REC_2026_02", "$14,500.00 USD", new BigDecimal("14500.00"),
                "Paid", "success", "Vietcombank •••• 8841 (Tài khoản thu hồi nợ)", "Sep 05, 2026", "Sep 07, 2026", "Đối soát nợ định kỳ tuần"
        ));

        payoutRepository.save(new Payout(
                "po_REC_2026_03", "$9,800.00 USD", new BigDecimal("9800.00"),
                "Paid", "success", "Vietcombank •••• 8841 (Tài khoản thu hồi nợ)", "Aug 29, 2026", "Aug 31, 2026", "Quyết toán công nợ tháng 8"
        ));

        payoutRepository.save(new Payout(
                "po_REC_2026_04", "$12,400.00 USD", new BigDecimal("12400.00"),
                "In Transit", "pending", "Vietcombank •••• 8841 (Tài khoản thu hồi nợ)", "Sep 14, 2026", "Expected Sep 16, 2026", "Đang chuyển khoản thu nợ"
        ));
    }

    private void seedConnectedAccounts() {
        if (connectedAccountRepository.count() > 0) return;

        connectedAccountRepository.save(new ConnectedAccount(
                "acct_CN_HN", "Chi nhánh Thu nợ Hà Nội & Miền Bắc", "Văn phòng thu hồi", "thuno.hn@debtmaster.vn",
                248, "$134,920.00 USD", "Enabled", "success", "Hà Nội, Việt Nam", "Vietcombank •••• 3120"
        ));

        connectedAccountRepository.save(new ConnectedAccount(
                "acct_CN_HCM", "Chi nhánh Quản lý Công nợ TP.HCM & Miền Nam", "Văn phòng thu hồi", "thuno.hcm@debtmaster.vn",
                412, "$252,180.00 USD", "Enabled", "success", "TP. Hồ Chí Minh, Việt Nam", "Techcombank •••• 7714"
        ));

        connectedAccountRepository.save(new ConnectedAccount(
                "acct_CN_DN", "Đại diện Thu nợ Khu vực Miền Trung", "Đại lý thu hộ", "thuno.mientrung@debtmaster.vn",
                98, "$41,200.00 USD", "Needs Info", "pending", "Đà Nẵng, Việt Nam", "BIDV •••• 9940"
        ));

        connectedAccountRepository.save(new ConnectedAccount(
                "acct_PARTNER_LAW", "Văn phòng Luật sư & Xử lý Nợ Pháp lý An Phát", "Đối tác pháp lý", "phaply@anphatlaw.vn",
                310, "$184,800.00 USD", "Enabled", "success", "Toàn quốc", "MBBank •••• 1152"
        ));
    }

    private void seedProducts() {
        if (productRepository.count() > 0) return;

        productRepository.save(new Product(
                "prod_DEBT_01", "Hợp đồng Nợ trả góp Thiết bị máy móc (12 tháng)",
                "Khoản nợ mua sắm trang thiết bị thanh toán định kỳ hàng tháng, lãi suất cam kết theo hợp đồng.",
                "$990.00 USD / mo", "Recurring (Monthly)", 142, "Active", "Jan 10, 2026"
        ));

        productRepository.save(new Product(
                "prod_DEBT_02", "Gói Nợ gối đầu Vật tư xây dựng & Công trình",
                "Hạn mức công nợ xoay vòng 30 - 60 ngày cho các nhà thầu thi công xây dựng.",
                "$2,500.00 USD / mo", "Recurring (Monthly)", 68, "Active", "Feb 15, 2026"
        ));

        productRepository.save(new Product(
                "prod_DEBT_03", "Hợp đồng Nợ tín dụng Thương mại thường niên",
                "Bảo lãnh và tài trợ thanh toán công nợ nhà cung cấp với thời hạn 1 năm.",
                "$12,000.00 USD / yr", "Recurring (Yearly)", 25, "Active", "Mar 01, 2026"
        ));

        productRepository.save(new Product(
                "prod_DEBT_04", "Gói Dịch vụ Tư vấn & Thu hồi Nợ Doanh nghiệp",
                "Thu phí dịch vụ xử lý hồ sơ công nợ quá hạn và đàm phán tất toán nợ xấu trọn gói.",
                "$1,500.00 USD", "One-time", 0, "Active", "May 12, 2026"
        ));

        productRepository.save(new Product(
                "prod_DEBT_05", "Thẩm định Hồ sơ Tín dụng & Xếp hạng Nợ",
                "Báo cáo điều tra năng lực tài chính, rà soát lịch sử tín dụng trước khi cấp công nợ.",
                "$500.00 USD", "One-time", 0, "Active", "Jun 20, 2026"
        ));
    }
}
